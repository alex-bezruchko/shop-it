const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlaceSchema = new Schema({
    name: String,
    place_id: String,
    address: String,
    rating: Number,
    types: [String],
    open_now: Boolean,
    link: String,
    // Add any other fields you need for a place
});

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
    }],
    favoritePlaces: [PlaceSchema] // Add favorite places array

});
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;