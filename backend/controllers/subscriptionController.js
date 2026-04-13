const Subscription = require('../models/Subscription');
const Product = require('../models/Product');

exports.createSubscription = async (req, res) => {
  try {
    const { product: productId, quantity, frequency, deliveryTime, deliveryAddress, startDate, endDate } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) return res.status(400).json({ message: 'Product not available' });
    const totalAmountPerDelivery = product.pricePerUnit * quantity;
    const sub = await Subscription.create({
      customer: req.user._id, product: productId, quantity, frequency,
      deliveryTime, deliveryAddress, startDate, endDate, totalAmountPerDelivery
    });
    await sub.populate('product', 'name category unit pricePerUnit');
    res.status(201).json(sub);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ customer: req.user._id })
      .populate('product', 'name category unit pricePerUnit').sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate('customer', 'name email phone')
      .populate('product', 'name category unit')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('product');
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id },
      { status: 'cancelled' }, { new: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json(sub);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
