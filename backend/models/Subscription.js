const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0.5 },
  frequency: { type: String, enum: ['daily', 'alternate', 'weekly'], default: 'daily' },
  deliveryTime: { type: String, default: 'morning', enum: ['morning', 'evening'] },
  deliveryAddress: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
  totalAmountPerDelivery: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
