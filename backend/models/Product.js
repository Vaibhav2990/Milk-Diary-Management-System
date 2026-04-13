const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['cow_milk', 'buffalo_milk', 'paneer', 'butter', 'ghee', 'curd', 'other'],
    required: true
  },
  description: { type: String, trim: true },
  pricePerUnit: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'litre', enum: ['litre', 'kg', 'gram', 'piece', 'packet'] },
  stockQuantity: { type: Number, default: 0, min: 0 },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
