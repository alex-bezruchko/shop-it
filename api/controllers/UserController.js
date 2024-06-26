const User = require('../models/User');
const ShoppingList = require('../models/ShoppingList');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const url = require('url');

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});


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
        
        // Check if a similar list already exists for the user
        const similarList = await ShoppingList.findOne({
            owner: userId,
            name: originalList.name,
            products: { $size: originalList.products.length }, // Ensure same number of products
            'products.product': { $all: originalList.products.map(p => p.product._id) } // Ensure same products
        });

        // If a similar list exists, return a message indicating that the list already exists
        if (similarList) {
            return res.status(400).json({ message: 'A similar list already exists for this user' });
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
        resetLink = url.resolve(process.env.LOCAL_URL, "/login");

        // Send email with password reset link
        const transporter = nodemailer.createTransport({
            host: process.env.NODE_SMTP_SERVER,
            port: 587, // or 465 for SSL
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NODE_MAILER, // Your Gmail email address
                pass: process.env.NODE_MAILER_KEY // Your Gmail password or app-specific password
            }
        });

        const mailOptions = {
            from: process.env.NODE_MAILER, // Sender email
            to: email,
            subject: 'Welcome to Shopit',
            text: `You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n
            Please click on the following link, or paste it into your browser to complete the process:\n\n
            ${resetLink}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
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
            const token = jwt.sign(
                { email: user.email, id: user._id, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '7d' } // Token expires in 7 days
            );

            // Set the cookie with the token
            res.cookie('token', token, { 
                httpOnly: true, 
                domain: process.env.DOMAIN,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
            }).json({ user, token });
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
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
};

exports.initiatePasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        let resetLink = "";

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a JWT token with user's email and current timestamp
        const token = jwt.sign({ email: user.email, timestamp: Date.now() }, process.env.JWT_SECRET);

        // Construct the password reset link with the token
        resetLink = url.resolve(process.env.LOCAL_URL, "/password-reset?token=" + token);

        // Send email with password reset link
        const transporter = nodemailer.createTransport({
            host: process.env.NODE_SMTP_SERVER,
            port: 587, // or 465 for SSL
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NODE_MAILER, // Your Gmail email address
                pass: process.env.NODE_MAILER_KEY // Your Gmail password or app-specific password
            }
        });

        const mailOptions = {
            from: process.env.NODE_MAILER, // Sender email
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n
            Please click on the following link, or paste it into your browser to complete the process:\n\n
            ${resetLink}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: `Password reset link sent successfully`});
    } catch (error) {
        res.status(500).json({ message: `Internal Server Error`});
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    let log;
    try {
        // Decode the token to get the email address
        const decodedToken = decodeToken(token);

        // Find the user by email
        const user = await User.findOne({ email: decodedToken.email });

        // If user not found or token is invalid, return error
        if (!user || !isValidToken(decodedToken)) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update user's password
        user.password = bcrypt.hashSync(newPassword, 10);
        log = user;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error, ${log}` });
    }
};
exports.logout = (req, res) => {
    res.cookie('token', '', { 
        expires: new Date(0), 
        domain: process.env.DOMAIN
    }).json(true);
};

exports.send = async (req, res) => {
    const { friendId } = req.params;
    const { userId } = req.body;
    let receiverId = friendId;
    let senderId = userId;

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

        // Send email notification to receiver
        const transporter = nodemailer.createTransport({
            host: process.env.NODE_SMTP_SERVER,
            port: 587, // or 465 for SSL
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NODE_MAILER, // Your email address
                pass: process.env.NODE_MAILER_KEY // Your email password or app-specific password
            }
        });

        const capitalizedReceiver = capitalizeName(receiver.name);
        const capitalizedSender = capitalizeName(sender.name);

        const mailOptions = {
            from: process.env.NODE_MAILER, // Sender email
            to: receiver.email, // Receiver email
            subject: 'Friend Request Received',
            text: `Hello ${capitalizedReceiver},\n\nYou have received a friend request from ${capitalizedSender}.\n\nYou can view your pending friend requests by logging into your account.\n\nBest regards,\nShopit App`
        };

        await transporter.sendMail(mailOptions);

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

        const outgoingRequest = {
            receiver: {
                _id: receiver._id,
                name: receiver.name,
                email: receiver.email
            },
            status: newRequest.status,
            _id: receiver._id
        };

        res.status(200).json(outgoingRequest);

        // Send Pusher notification to receiver
        sendNotification(`user-${receiverId}`, 'friend-request-received', { 
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
        // Send Pusher notification to sender

        sendNotification(`user-${sender._id}`, 'friend-request-submitted', { 
            message: 'You submitted a friend request.', 
            outgoingRequest: {
                _id: receiver._id,
                receiver: {
                    _id: receiver._id,
                    name: receiver.name,
                    email: receiver.email
                },
                sender: sender._id,
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
         // Send email notification to Joe
        const joe = await User.findById(requesterId);
        const acceptor = await User.findById(userId);
        const transporter = nodemailer.createTransport({
            host: process.env.NODE_SMTP_SERVER,
            port: 587, // or 465 for SSL
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NODE_MAILER, // Your email address
                pass: process.env.NODE_MAILER_KEY // Your email password or app-specific password
            }
        });
        const capitalizedSender = capitalizeName(joe.name);
        const capitalizedAcceptor = capitalizeName(acceptor.name);
        const mailOptions = {
            from: process.env.NODE_MAILER, // Sender email
            to: joe.email, // Joe's email
            subject: 'Friend Request Accepted',
            text: `Hello ${capitalizedSender},\n\nYour friend request has been accepted by ${capitalizedAcceptor}.\n\nYou are now friends.\n\nBest regards,\nShopit App`
        };

        await transporter.sendMail(mailOptions);

        sendNotification(`user-${userId}`, 'receiver-request-accepted', { message: 'You are now friends.', receiver: requesterId });
        sendNotification(`user-${requesterId}`, 'sender-request-accepted', { message: 'Your friend request has been accepted.', sender: userId });

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

function decodeToken(token) {
    try {
        // Decode the token to extract email and id
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (error) {
        // Handle token verification errors
        throw new Error('Invalid token');
    }
}

function isValidToken(decodedToken) {
    // Check if the token is still valid (e.g., not expired)
    const currentTime = Date.now();
    const tokenExpirationTime = decodedToken.timestamp + (24 * 60 * 60 * 1000); // Token expires in 24 hours
    return currentTime < tokenExpirationTime;
}

function capitalizeName(name) {
    // Split the name by spaces
    const nameParts = name.split(' ');
    // Capitalize the first letter of each part
    const capitalizedParts = nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
    // Join the parts back together with spaces
    const capitalizedFullName = capitalizedParts.join(' ');
    return capitalizedFullName;
}