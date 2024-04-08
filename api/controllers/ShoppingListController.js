const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User');

// Controller for creating a new shopping list
exports.createShoppingList = async (req, res) => {
    try {
        const { name, products, completed } = req.body;
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const productIds = products.map(product => ({ product: product._id, completed: product.completed }));
        const shoppingList = new ShoppingList({
            name,
            owner: userId,
            products: productIds,
            completed
        });

        await shoppingList.save();
        res.status(201).json({ message: 'Shopping list created successfully.', shoppingList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Controller for fetching shopping list by ID or recent
exports.getShoppingList = async (req, res) => {
    try {
        const listId = req.params.listId;
        let query = {};

        // Access ownerId from request query
        const { ownerId } = req.query;

        if (listId === 'recent' || !listId) {
            query = ShoppingList.findOne({ owner: ownerId }).sort({ createdAt: -1 });
        } else {
            query = ShoppingList.findById(listId);
        }

        const shoppingList = await query.populate('products.product');

        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found.' });
        }

        res.status(200).json({ message: 'Shopping list fetched successfully', data: shoppingList });
    } catch (error) {
        console.error('Error fetching shopping list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Controller for updating a shopping list
exports.updateShoppingList = async (req, res) => {
    try {
        const listId = req.params.listId;
        const { products, name } = req.body;

        const shoppingList = await ShoppingList.findById(listId);
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found.' });
        }

        let productIds = products.filter(product => product.completed === true);
        shoppingList.completed = productIds.length === products.length;
        shoppingList.products = products;
        shoppingList.name = name;

        await shoppingList.save();
        res.status(200).json({ message: 'Shopping list updated successfully', data: shoppingList });
    } catch (error) {
        console.error('Error updating shopping list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller for fetching shopping lists by owner ID
exports.getShoppingListsByOwner = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const { completed } = req.query;

        let query = { owner: ownerId };
        if (completed && completed.toLowerCase() === 'true') {
            query.completed = true;
        }

        const shoppingLists = await ShoppingList.find(query).sort({ createdAt: -1 });
        res.json({ shoppingLists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Controller for deleting a shopping list
exports.deleteShoppingList = async (req, res) => {
    try {
        const listId = req.params.listId;
        const deleteList = await ShoppingList.findByIdAndDelete(listId);
        if (!deleteList) {
            res.status(404).json({ message: "List not found" });
        } else {
            res.json({ message: "List deleted successfully", deleteList });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
