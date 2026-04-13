const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

exports.getMyDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { distributor: req.user._id };
    if (status) filter.status = status;
    const deliveries = await Delivery.find(filter)
      .populate('customer', 'name phone address')
      .populate('order', 'totalAmount items')
      .sort({ scheduledDate: 1 });
    res.json(deliveries);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const delivery = await Delivery.findOne({ _id: req.params.id, distributor: req.user._id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    delivery.status = status;
    if (notes) delivery.notes = notes;
    if (status === 'delivered') {
      delivery.deliveredAt = new Date();
      if (delivery.order) await Order.findByIdAndUpdate(delivery.order, { status: 'delivered' });
    }
    await delivery.save();
    res.json(delivery);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json(delivery);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('distributor', 'name phone')
      .populate('customer', 'name phone address')
      .populate('order')
      .sort({ scheduledDate: -1 });
    res.json(deliveries);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
