const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
