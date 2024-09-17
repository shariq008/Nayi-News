const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Category = require('../models/category');
const mongoose = require('mongoose');

// Helper function to check if an ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('category');
    res.status(200).json({ 
      message: 'تمام مضامین حاصل کر لئے گئے ہیں',
      data: articles 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

// POST create a new article
router.post('/', async (req, res) => {
  const { title, content, category, author } = req.body;

  if (!isValidObjectId(category)) {
    return res.status(400).json({ 
      error: 'غلط زمرہ ID' 
    });
  }

  try {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) return res.status(404).json({ 
      error: 'زمرہ نہیں ملا' 
    });

    const article = new Article({ title, content, category, author });
    await article.save();
    res.status(201).json({ 
      message: 'نیا مضمون کامیابی سے تخلیق کر لیا گیا',
      data: article 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

// PUT update an article
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category, author } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ 
      error: 'غلط مضمون ID' 
    });
  }

  if (category && !isValidObjectId(category)) {
    return res.status(400).json({ 
      error: 'غلط زمرہ ID' 
    });
  }

  try {
    const article = await Article.findByIdAndUpdate(id, { title, content, category, author }, { new: true });
    if (!article) return res.status(404).json({ 
      error: 'مضمون نہیں ملا' 
    });
    res.status(200).json({ 
      message: 'مضمون کامیابی سے اپ ڈیٹ کر دیا گیا',
      data: article 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

// DELETE an article
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ 
      error: 'غلط مضمون ID' 
    });
  }

  try {
    const article = await Article.findByIdAndDelete(id);
    if (!article) return res.status(404).json({ 
      error: 'مضمون نہیں ملا' 
    });
    res.status(200).json({ 
      message: 'مضمون کامیابی سے حذف کر دیا گیا' 
    });
  } catch (err) {
    res.status(400).json({ 
      error: 'خطا: ' + err.message 
    });
  }
});

module.exports = router;
