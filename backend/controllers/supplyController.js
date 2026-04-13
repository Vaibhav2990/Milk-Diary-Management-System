const Supply = require('../models/Supply');
const Product = require('../models/Product');

exports.addSupply = async (req, res) => {
  try {
    const { milkType, quantity, unit, pricePerUnit, supplyDate, fatPercentage, quality, notes } = req.body;
    const totalAmount = quantity * pricePerUnit;
    const supply = await Supply.create({
      supplier: req.user._id, milkType, quantity, unit, pricePerUnit,
      totalAmount, supplyDate, fatPercentage, quality, notes
    });

    // Update product stock based on milk type
    const categoryMap = { cow_milk: 'cow_milk', buffalo_milk: 'buffalo_milk', mixed: 'cow_milk' };
    await Product.findOneAndUpdate(
      { category: categoryMap[milkType], isAvailable: true },
      { $inc: { stockQuantity: quantity } }
    );

    await supply.populate('supplier', 'name email');
    res.status(201).json(supply);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getMySupplies = async (req, res) => {
  try {
    const supplies = await Supply.find({ supplier: req.user._id }).sort({ supplyDate: -1 });
    res.json(supplies);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find().populate('supplier', 'name email phone').sort({ supplyDate: -1 });
    res.json(supplies);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSupply = async (req, res) => {
  try {
    const supply = await Supply.findOne({ _id: req.params.id, supplier: req.user._id });
    if (!supply) return res.status(404).json({ message: 'Supply record not found' });
    const updated = await Supply.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.quantity && req.body.pricePerUnit) updated.totalAmount = req.body.quantity * req.body.pricePerUnit;
    await updated.save();
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paidAmount } = req.body;
    const supply = await Supply.findByIdAndUpdate(req.params.id, { paymentStatus, paidAmount }, { new: true }).populate('supplier', 'name');
    if (!supply) return res.status(404).json({ message: 'Supply not found' });
    res.json(supply);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
