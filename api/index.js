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

const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
};

app.use(cors(corsOptions));

// Preconnect Header
app.use((req, res, next) => {
    // Add preconnect header for Google Fonts
    res.setHeader('Link', '<https://fonts.gstatic.com>; rel=preconnect');
    next();
});

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

app.get('/places', async (req, res) => {
    const { query, zipCode } = req.query;
  
    if (!query || !zipCode ) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const key = process.env.GOOGLE_MAPS_API;
    try {
      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${key}`);
      const geocodeData = await geocodeResponse.json();
  
      if (geocodeData.status !== "OK" || geocodeData.results.length === 0) {
        console.error('Invalid zip code');
        return res.status(400).json({ error: 'Invalid zip code' });
      }
      
      const { lat, lng } = geocodeData.results[0].geometry.location;
  
      const placesResponse = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&key=${key}`);
      const placesData = await placesResponse.json();
  
      if (placesData.status === "OK") {
        // Extract locations for markers
        const markers = placesData.results.map(result => ({
          position: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          }
        }));
  
        res.json({ places: placesData.results, markers: markers });
      } else {
        console.error('Error searching for places:', placesData.error_message || placesData.status);
        res.status(500).json({ error: placesData.error_message || 'Error searching for places' });
      }
    } catch (error) {
      console.error('Error searching for places:', error);
      res.status(500).json({ error: 'An error occurred while searching for places' });
    }
});

app.get('/search/photos', async (req, res) => {
  const { query, page } = req.query;
  const pageNumber = page || 1;
  const url = `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${query}`;
try {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            'Content-Type': 'application/json'
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch data from Unsplash API');
    }
    const data = await response.json();
    res.json(data);
} catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
