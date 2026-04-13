const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all required fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const allowedRoles = ['customer', 'distributor', 'supplier'];
    const userRole = allowedRoles.includes(role) ? role : 'customer';

    const user = await User.create({ name, email, password, role: userRole, phone, address });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, address: user.address,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, address: user.address,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (password) user.password = password;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
