const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, orderType, notes, deliveryDate } = req.body;
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isAvailable) return res.status(400).json({ message: `Product ${item.product} not available` });
      if (product.stockQuantity < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      orderItems.push({ product: product._id, quantity: item.quantity, priceAtOrder: product.pricePerUnit });
      totalAmount += product.pricePerUnit * item.quantity;
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id, items: orderItems, totalAmount,
      deliveryAddress, orderType, notes, deliveryDate
    });
    await order.populate('items.product customer');
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name category unit')
      .populate('assignedDistributor', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name category unit pricePerUnit')
      .populate('assignedDistributor', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, assignedDistributor } = req.body;
    const update = { status };
    if (assignedDistributor) update.assignedDistributor = assignedDistributor;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('customer', 'name email').populate('items.product').populate('assignedDistributor', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (['delivered', 'cancelled'].includes(order.status)) return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
