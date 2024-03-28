const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = 'pass123';

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(422).json({ message: 'Failed to register user', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, user.password);

        if (passOk) {
            const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret);
            // Set the cookie with an expiration time and additional attributes
            res.cookie('token', token, { 
                httpOnly: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                sameSite: 'strict', // Prevent CSRF attacks
                secure: process.env.NODE_ENV === 'production' // Set to true in production
            }).json(user);
        } else {
            res.status(422).json({ message: 'Password incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.profile = async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '').json(true);
};
