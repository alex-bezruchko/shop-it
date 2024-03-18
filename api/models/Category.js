// category.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
