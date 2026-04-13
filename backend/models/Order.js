const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrder: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: { type: String, required: true },
  assignedDistributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  orderType: { type: String, enum: ['one-time', 'subscription'], default: 'one-time' },
  notes: { type: String, default: '' },
  deliveryDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
