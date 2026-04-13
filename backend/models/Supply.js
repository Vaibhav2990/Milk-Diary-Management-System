const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  milkType: { type: String, enum: ['cow_milk', 'buffalo_milk', 'mixed'], required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'litre' },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  supplyDate: { type: Date, required: true, default: Date.now },
  fatPercentage: { type: Number, default: 0 },
  quality: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' },
  paidAmount: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Supply', supplySchema);
