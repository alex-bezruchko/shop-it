const User = require('../models/User');
const ShoppingList = require('../models/ShoppingList');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});

const jwtSecret = 'pass123';

function sendNotification(channel, event, data) {
    pusher.trigger(channel, event, data);
  }
  

exports.getAll = async (req, res) => {
    const { search } = req.query;
    try {
        let users;
        if (search) {
            // If search query is provided, find users whose name or email matches the search query
            users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } }, // Case-insensitive regex search for name
                    { email: { $regex: search, $options: 'i' } } // Case-insensitive regex search for email
                ]
            }, 'name email');
        } else {
            // If no search query provided, fetch all users
            users = await User.find({}, 'name email');
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

exports.getFriendInfo = async (req, res) => {
    const { userId, friendId } = req.params;
    
    try {
        // Check if the users are friends
        const areFriends = await areUsersFriends(userId, friendId);

        if (!areFriends) {
            return res.status(403).json({ message: "You are not friends with this user." });
        }

        // Fetch user's lists, places, and friends
        const user = await User.findById(friendId)
            .populate('favoritePlaces')
            .populate('friends', 'name email');
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch user's shopping lists with product names
        const lists = await ShoppingList.find({ owner: friendId }).populate({
            path: 'products.product',
            model: 'Product',
            select: 'name category'
        });

        // Return user's lists, places, and friends along with shopping lists
        res.json({ user, lists });
    } catch (error) {
        console.error("Error fetching user's data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.places = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('favoritePlaces');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.favoritePlaces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.addPlace = async (req, res) => {
    const userId = req.params.userId;
    const { place } = req.body; // Assuming the place details are sent in the request body

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let ifDupe = false;
        if (user.favoritePlaces.length > 0) {
            let ifPlaceExists = user.favoritePlaces.find(favPlace => favPlace.place_id === place.place_id);
            if (ifPlaceExists) {
                let newPlaces = user.favoritePlaces.filter(favPlace => favPlace.place_id !== place.place_id)
                user.favoritePlaces = newPlaces;
                ifDupe = true;
            } else {
                user.favoritePlaces.push(place);
            }
        } else {
            user.favoritePlaces.push(place);
        }
       
        // Add the new place to the user's favorite places array
        await user.save();
        let message = '';
        if (ifDupe) {
            message = 'Place removed from favorites'
        } else {
            message = "Place added to favorites"
        }
        res.json({ message: message, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.copyPlace = async (req, res) => {
    const listId = req.params.listId;
    const userId = req.body.userId; // Assuming userId is passed in the request body
    try {
        // Find the original shopping list
        const originalList = await ShoppingList.findById(listId).populate('products.product');
        if (!originalList) {
        return res.status(404).json({ message: 'Shopping list not found' });
        }
        
        // Create a copy of the original list with a new owner
        const copiedList = new ShoppingList({
        name: originalList.name,
        owner: userId, // New owner
        products: originalList.products.map(product => ({ product: product.product._id, completed: false })),
        completed: false,
        createdAt: new Date(),
        editedAt: null
        });

        // Save the copied list
        await copiedList.save();

        res.json({ message: 'Shopping list copied successfully', copiedList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(422).json({ message: 'Failed to register user', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, user.password);

        if (passOk) {
            const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret);
            // Set the cookie with an expiration time and additional attributes
            res.cookie('token', token, { 
                httpOnly: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                // sameSite: 'strict', // Prevent CSRF attacks
                domain: process.env.DOMAIN,
                secure: process.env.NODE_ENV === 'production' // Set to true in production
            }).json(user);
        } else {
            res.status(422).json({ message: 'Password incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.profile = async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '').json(true);
};

exports.send = async (req, res) => {
    const { friendId } = req.params;
    const { userId } = req.body;
    let receiverId = friendId;
    let senderId = userId;

    console.log('senderId', senderId);
    console.log('receiverId', receiverId);

    try {
        // Find sender and receiver
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        // Check if sender or receiver is not found
        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        // Check if the receiver is already in the sender's friend list
        const alreadyFriends = sender.friends.includes(receiverId);
        if (alreadyFriends) {
            return res.status(400).json({ error: "You are already friends" });
        }

        // Check if a request has already been sent
        const alreadyRequested = sender.outgoingRequests.some(req => req.receiver.toString() === receiverId);
        if (alreadyRequested) {
            return res.status(400).json({ error: "Friend request already sent" });
        }

        // Create a friend request including sender's ID
        const newRequest = {
            receiver: receiverId,
            sender: senderId, // Include the sender's ID
            status: 'pending'
        };
        
        // Add the request to the sender's outgoingRequests
        sender.outgoingRequests.push(newRequest);
        await sender.save();

        // Add the request to the receiver's friendRequests
        receiver.friendRequests.push(newRequest);
        await receiver.save();

        // Now, manually populate sender's and receiver's name and email
        const friendRequest = {
            sender: {
                _id: sender._id,
                name: sender.name,
                email: sender.email
            },
            status: newRequest.status,
            _id: sender._id
        };

        res.status(200).json({ friendRequests: [friendRequest], outgoingRequests: [] });

        // Send Pusher notification to receiver
        sendNotification(`user-${receiverId}`, 'friend-request', { 
            message: 'You received a friend request.', 
            friendRequest: {
                _id: friendRequest._id,
                sender: {
                    _id: sender._id,
                    name: sender.name,
                    email: sender.email
                },
                receiver: receiverId,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


exports.accept = async (req, res) => {
    const { userId, requesterId } = req.params;
    try {
        // Add userId to requesterId's friends array
        await User.findByIdAndUpdate(requesterId, { $addToSet: { friends: userId } });
        // Add requesterId to userId's friends array
        await User.findByIdAndUpdate(userId, { $addToSet: { friends: requesterId } });

        // Find the request in the requester's friendRequests array and update its status to 'accepted'
        await User.findOneAndUpdate(
            { _id: requesterId, 'friendRequests.sender': userId },
            { $set: { 'friendRequests.$.status': 'accepted' } }
        );

        // Find the request in the userId's outgoingRequests array and update its status to 'accepted'
        await User.findOneAndUpdate(
            { _id: userId, 'outgoingRequests.receiver': requesterId },
            { $set: { 'outgoingRequests.$.status': 'accepted' } }
        );

        // Remove the request from userId's friendRequests
        await User.findByIdAndUpdate(userId, { $pull: { friendRequests: { sender: requesterId } } });

        // Remove the request from the requesterId's outgoingRequests
        await User.findByIdAndUpdate(requesterId, { $pull: { outgoingRequests: { receiver: userId } } });

        res.status(200).send("Friend request accepted successfully.");
        sendNotification(`user-${userId}`, 'receiver-request-accepted', { message: 'Your friend request has been accepted.', receiver: requesterId });
        sendNotification(`user-${requesterId}`, 'sender-request-accepted', { message: 'You are now friends.', sender: userId });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

exports.decline = async (req, res) => {
    const { userId, requesterId } = req.params;
    try {
        // Remove the request from userId's outgoingRequests
        await User.findByIdAndUpdate(userId, { $pull: { outgoingRequests: { receiver: requesterId } } });

        // Remove the request from requesterId's friendRequests
        await User.findByIdAndUpdate(requesterId, { $pull: { friendRequests: { sender: userId } } });

        // Remove the request from userId's friendRequests as well
        await User.findByIdAndUpdate(userId, { $pull: { friendRequests: { sender: requesterId } } });

        // Remove the request from requesterId's outgoingRequests as well
        await User.findByIdAndUpdate(requesterId, { $pull: { outgoingRequests: { receiver: userId } } });

        res.status(200).send("Friend request declined successfully.");
        sendNotification(`user-${userId}`, 'receiver-request-denied', { message: 'Your friend request has been denied.', receiver: requesterId });
        sendNotification(`user-${requesterId}`, 'sender-request-denied', { message: 'You are now friends.', sender: userId });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

exports.friends = async (req, res) => {
    const { userId } = req.params;
    try {
        // Find user by userId and populate the 'friends' field
        const user = await User.findById(userId).populate('friends');
        res.status(200).json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

exports.pendingRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        // Find user by userId and populate both incoming and outgoing friendRequests
        const user = await User.findById(userId)
            .populate({
                path: 'friendRequests',
                populate: {
                    path: 'sender', // Populating sender information for incoming requests
                    model: 'User',
                    select: 'name email' // Selecting name and email fields of the sender
                }
            })
            .populate({
                path: 'outgoingRequests',
                populate: {
                    path: 'receiver', // Populating receiver information for outgoing requests
                    model: 'User',
                    select: 'name email' // Selecting name and email fields of the receiver
                }
            });

        // Filter out accepted friend requests from the incoming requests
        const filteredFriendRequests = user.friendRequests.filter(request => request.status === 'pending');

        // Filter out pending outgoing requests
        const filteredOutgoingRequests = user.outgoingRequests.filter(request => request.status === 'pending');

        // Send the filtered friendRequests and outgoingRequests in the response
        res.status(200).json({ friendRequests: filteredFriendRequests, outgoingRequests: filteredOutgoingRequests });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function areUsersFriends(userId, friendId) {
    const user = await User.findById(userId).populate('friends');
    if (!user) return false;

    // Check if the friendId exists in the user's friends array
    return user.friends.some(friend => friend._id.toString() === friendId);
}
