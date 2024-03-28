const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Route for creating a new category
router.post('/', CategoryController.createCategory);

// Route for fetching all categories
router.get('/', CategoryController.getAllCategories);

module.exports = router;
