const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/all', ProductController.getAllProducts);

router.get('/paged', ProductController.paged);

router.get('/search', ProductController.searchProducts);

router.get('/:id', ProductController.getProductById);

router.post('/', ProductController.createProduct);

router.put('/:id', ProductController.updateProduct); // Include the put route for updating a product

module.exports = router;
