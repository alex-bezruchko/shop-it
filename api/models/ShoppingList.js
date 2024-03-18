const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
