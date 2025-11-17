const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  name: { type: String, required: true },
  description: String,
  size: String,                // مثلاً: "18L", "12L"
  category: String,            // مثلًا: "مياه", "معدات"
  wholesalePrice: { type: Number, required: true },
  retailPrice: Number,
  quantityInStock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
