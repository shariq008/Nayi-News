const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: String },
  datePublished: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
