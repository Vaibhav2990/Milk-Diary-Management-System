const Order = require('../models/Order');
const User = require('../models/User');
const Supply = require('../models/Supply');
const Product = require('../models/Product');
const Subscription = require('../models/Subscription');

exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalOrders, pendingOrders, deliveredOrders, totalRevenue,
      totalCustomers, totalDistributors, totalSuppliers,
      totalSupplyLitres, pendingPayments, totalProducts, activeSubscriptions
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'distributor' }),
      User.countDocuments({ role: 'supplier' }),
      Supply.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
      Supply.aggregate([{ $match: { paymentStatus: 'pending' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Product.countDocuments({ isAvailable: true }),
      Subscription.countDocuments({ status: 'active' }),
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      orders: { total: totalOrders, pending: pendingOrders, delivered: deliveredOrders },
      revenue: { total: totalRevenue[0]?.total || 0, pendingSupplierPayments: pendingPayments[0]?.total || 0 },
      users: { customers: totalCustomers, distributors: totalDistributors, suppliers: totalSuppliers },
      supply: { totalLitres: totalSupplyLitres[0]?.total || 0 },
      products: { available: totalProducts },
      subscriptions: { active: activeSubscriptions },
      monthlyRevenue,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
