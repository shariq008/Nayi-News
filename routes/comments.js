const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Article = require('../models/article');
const User = require('../models/user');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('article').populate('user');
    res.status(200).json({ message: 'Comments retrieved successfully', data: comments });
  } catch (err) {
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

// POST create a new comment
router.post('/', async (req, res) => {
  const { article, user, content } = req.body;
  try {
    const existingArticle = await Article.findById(article);
    if (!existingArticle) return res.status(404).json({ error: 'Article not found' });

    const existingUser = await User.findById(user);
    if (!existingUser) return res.status(404).json({ error: 'User not found' });

    const comment = new Comment({ article, user, content });
    await comment.save();
    res.status(201).json({ message: 'Comment created successfully', data: comment });
  } catch (err) {
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

// PUT update a comment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.status(200).json({ message: 'Comment updated successfully', data: comment });
  } catch (err) {
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

// DELETE a comment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

module.exports = router;
