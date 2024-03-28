const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: '*',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }));
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
};


app.use(cors(corsOptions));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

// Routes
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const shoppingListRoutes = require('./routes/shoppinglists');


app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/shoppinglists', shoppingListRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
