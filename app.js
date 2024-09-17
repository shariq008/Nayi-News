const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const authenticate = require('./middleware/auth');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

require('dotenv').config();


const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register routes
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Initialize default categories
const Category = require('./models/category');
Category.initializeDefaultCategories()
  .then(() => console.log('Default categories initialized'))
  .catch(err => console.error('Error initializing categories:', err.message));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
