const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{
        sender: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the sender
        status: { type: String, enum: ['pending', 'accepted', 'declined'] } // Status of the request
    }],
    outgoingRequests: [{
        receiver: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the receiver
        status: { type: String, enum: ['pending', 'accepted', 'declined'] } // Status of the request
    }]
});
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;