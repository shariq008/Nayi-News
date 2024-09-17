const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const mongoose = require('mongoose');

// Helper function to check if an ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ 
      message: 'تمام زمرے حاصل کر لئے گئے ہیں',
      data: categories 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

// POST create a new category
router.post('/', async (req, res) => {
  const { name, description, isDefault } = req.body;
  try {
    const category = new Category({ name, description, isDefault });
    await category.save();
    res.status(201).json({ 
      message: 'نیا زمرہ کامیابی سے تخلیق کر لیا گیا',
      data: category 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

// PUT update a category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, isDefault } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ 
      error: 'غلط زمرہ ID' 
    });
  }

  try {
    const category = await Category.findByIdAndUpdate(id, { name, description, isDefault }, { new: true });
    if (!category) return res.status(404).json({ 
      error: 'زمرہ نہیں ملا' 
    });
    res.status(200).json({ 
      message: 'زمرہ کامیابی سے اپ ڈیٹ کر دیا گیا',
      data: category 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ 
      error: 'غلط زمرہ ID' 
    });
  }

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ 
      error: 'زمرہ نہیں ملا' 
    });
    res.status(200).json({ 
      message: 'زمرہ کامیابی سے حذف کر دیا گیا' 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

module.exports = router;
