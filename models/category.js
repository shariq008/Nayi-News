const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isDefault: { type: Boolean, default: false }
});

// Method to initialize default categories
categorySchema.statics.initializeDefaultCategories = async function() {
  const defaultCategories = [
    'THE FIRST PAGE',
    'THE LATEST',
    'PAKISTAN',
    'INTERNATIONAL',
    'THE GAME',
    'SHOWBIZ',
    'BUSINESS',
    'HEALTH',
    'SCIENCE AND TECHNOLOGY',
    'INTERESTING AND STANCE',
    'ZERO POINT',
    'SPECIAL FEATURES',
    'COLUMN',
    'TODAYS MOST READ NEWS',
    'REPORT'
  ];

  for (const cat of defaultCategories) {
    const exists = await this.findOne({ name: cat });
    if (!exists) {
      await this.create({ name: cat, isDefault: true });
    }
  }
};

module.exports = mongoose.model('Category', categorySchema);
