const Product = require('../models/Product');

// Controller for fetching all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for fetching a product by ID
exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateProduct = async (req, res) => {
    console.log('req', req.params)
    const productId = req.params.id;
    const { name, description, photo, price, category } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            description,
            photo,
            price,
            category
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(422).json(error);
    }
};

// Controller for creating a new product
exports.createProduct = async (req, res) => {
    const { name, description, photo, price, category } = req.body;
    try {
        const newProduct = await Product.create({
            name,
            description,
            photo,
            price,
            category
        });
        res.json(newProduct);
    } catch (error) {
        res.status(422).json(error);
    }
};

// Controller for searching products
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.query;
        console.log("Query received:", query); // Debug statement
        if (!query) {
            return res.status(400).json({ message: 'Name query parameter is required.' });
        }
        const products = await Product.find({ name: { $regex: new RegExp(query, 'i') } });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the name query.' });
        }
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
