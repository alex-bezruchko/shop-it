const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Product = require('./models/Product.js');
const ShoppingList = require('./models/ShoppingList.js');

const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'pass123';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));

mongoose.connect(process.env.MONGO_URL);
app.options('*', cors()); // Handle preflight requests for all routes


app.post('/register', async (req, res) => {
    const {name, email, password } = req.body;

    try {
        const newUser = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(newUser);
    } catch(e) {
        res.status(422).json(e);
    }

});
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/products', async (req, res) => {
    const {name, description, photo, price } = req.body;
    try {
        const newProduct = await Product.create({
            name,
            description,
            photo,
            price
        })
        res.json(newProduct)

    } catch (e) {
        res.status(422).json(e)
    }
});
app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { email, password } = req.body;

    try {
        const userInfo = await User.findOne({email});
        if (userInfo) {
            const passOk = bcrypt.compareSync(password, userInfo.password);
            if (passOk) {
                jwt.sign({email: userInfo.email, id: userInfo._id}, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userInfo);
                });
            } else {
                res.status(422).json('Password incorrect');
            }
        } else {
            res.status(404).json('User not found');
        }
    } catch(e) {
        console.error(e);
        res.status(500).json('Internal server error');
    }

})
app.get('/test', (req, res) => {
    res.json('it`s okay')
})
app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id});
        });
    } else {
        res.json(null);
    }
})

app.post('/user/:userId/shoppinglist', async (req, res) => {
    try {
        const { name, products, owner, completed } = req.body;
        const userId = owner;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const productIds = products.map(product => ({ product: product._id, completed: product.completed }));

        // Create shopping list object
        const shoppingList = new ShoppingList({
            name: name,
            owner: userId,
            products: productIds,
            completed: completed
        });
    
        // Save shopping list to database
        await shoppingList.save();
    
        res.status(201).json({ message: 'Shopping list created successfully.', shoppingList });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});
app.get('/shoppinglists/:listId', async (req, res) => {
    try {
        const listId = req.params.listId;
        
        if (listId === 'recent' || listId == '' || listId == undefined) {
            // Fetch the most recent shopping list from the database
            const mostRecentList = await ShoppingList.findOne().sort({ createdAt: -1 }).populate('products.product');
            res.status(200).json({ message: 'Most recent shopping list fetched successfully', data: mostRecentList });
        } else {
            // Fetch the shopping list by its ID
            const shopList = await ShoppingList.findById(listId).populate('products.product');
            res.status(200).json({ message: 'Shopping list fetched successfully', data: shopList });
        }
    } catch(error) {
        console.error('Error updating shopping list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.put('/shoppinglists/:listId', async (req, res) => {
    try {
        const listId = req.params.listId;
        const { products } = req.body;

        const shopList = await ShoppingList.findById(listId);
        let productIds = products.filter(product => product.completed === true);

        if (productIds?.length === products.length) {
            shopList.completed = true;
        } else {
            shopList.completed = false;
        }
        shopList.products = products;
        await shopList.save();

        // Send back a success response
        res.status(200).json({ message: 'Shopping list updated successfully', data: shopList });
    } catch (error) {
        // Handle errors
        console.error('Error updating shopping list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/shoppinglists/owner/:ownerId', async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const { completed } = req.query;

        const query = { owner: ownerId };

        if (completed && completed.toLowerCase() === 'true') {
            query.completed = true;
        }

        const shoppingLists = await ShoppingList.find(query).sort({ createdAt: -1 });

        res.json({ shoppingLists });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.get('/products/search', async (req, res) => {
    try {
      const query = req.query.query; // Assuming the query parameter is named 'name'
      if (!query) {
        return res.status(400).json({ message: 'Name query parameter is required.' });
      }
  
      const products = await Product.find({ name: { $regex: new RegExp(query, 'i') } });
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found matching the name query.' });
      }
  
      res.json({ products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
}) 
const PORT = process.env.PORT || 4000; // Listen on the specified port or default to 5173
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
