const Category = require('../models/Category');

// Controller for creating a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.json(newCategory);
    } catch (error) {
        res.status(422).json(error);
    }
};

// Controller for fetching all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
