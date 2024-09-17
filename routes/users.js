const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/auth');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Helper function to check if an ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming req.user is populated by authentication middleware
    const user = await User.findById(userId);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        error: 'Access denied. Admins only.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// GET all users (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    res.status(400).json({
      error: 'Error: ' + err.message
    });
  }
});

// POST create a new user (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    const user = new User({ username, password, email, role });
    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      data: user
    });
  } catch (err) {
    res.status(400).json({
      error: 'Error: ' + err.message
    });
  }
});

// PUT update a user (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, password, email, role } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error: 'Invalid user ID'
    });
  }

  try {
    const updateData = { username, email, role };

    // Hash the new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({
      error: 'User not found'
    });
    res.status(200).json({
      message: 'User updated successfully',
      data: user
    });
  } catch (err) {
    res.status(400).json({
      error: 'Error: ' + err.message
    });
  }
});

// DELETE a user (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error: 'Invalid user ID'
    });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({
      error: 'User not found'
    });
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      error: 'Error: ' + err.message
    });
  }
});

module.exports = router;
