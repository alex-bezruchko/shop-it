const mongoose = require('mongoose');
const {Schema} = mongoose;
const ProductSchema = new Schema({
    name: String,
    description: String,
    photo: String,
    price: String,
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;