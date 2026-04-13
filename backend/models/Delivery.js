const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_transit', 'delivered', 'failed'], default: 'pending' },
  scheduledDate: { type: Date, required: true },
  deliveredAt: { type: Date },
  notes: { type: String, default: '' },
  route: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
