const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = 'pass123';

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
                sameSite: 'strict', // Prevent CSRF attacks
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

        res.status(200).json({ message: "Friend request sent successfully" });
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

// exports.pendingRequests = async (req, res) => {
//     const { userId } = req.params;
//     try {
//         // Find user by userId and populate the 'friendRequests' field
//         const user = await User.findById(userId).populate('friendRequests', 'name email');
//         const populatedRequests = await User.populate(user, { path: 'friendRequests', select: 'name email' });
//         res.status(200).json(populatedRequests.friendRequests);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// }
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

