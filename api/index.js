const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Product = require('./models/Product.js');

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
        console.log(userInfo);
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

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
}) 
const PORT = process.env.PORT || 4000; // Listen on the specified port or default to 5173
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
