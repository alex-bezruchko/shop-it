const express = require('express');
const router = express.Router();
const ShoppingListController = require('../controllers/ShoppingListController');

// Route for creating a new shopping list
router.post('/:userId', ShoppingListController.createShoppingList);

// Route for fetching shopping list by ID or recent
router.get('/:listId', ShoppingListController.getShoppingList);

// Route for updating a shopping list
router.put('/:listId', ShoppingListController.updateShoppingList);

router.delete('/:listId', ShoppingListController.deleteShoppingList);

// Route for fetching shopping lists by owner ID
router.get('/owner/:ownerId', ShoppingListController.getShoppingListsByOwner);

module.exports = router;
