const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Configuration (FINAL FIX)
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    // allow all Vercel domains
    if (
      origin.includes("vercel.app") ||
      origin === process.env.CLIENT_URL ||
      origin === "http://localhost:3000"
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/supply', require('./routes/supply'));
app.use('/api/delivery', require('./routes/delivery'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/analytics', require('./routes/analytics'));

// Root route
app.get('/', (req, res) => {
    res.json({ message: '🥛 Milk Dairy Management System API Running' });
});

// ── TEMP FIX ROUTES - Add above the 404 handler ──
app.get('/create-all-demo', async(req, res) => {
    const User = require('./models/User');
    try {
        const demoUsers = [
            { name: 'Dairy Owner', email: 'owner@dairy.com', password: 'password123', role: 'owner', phone: '9876543210', address: 'Dairy Farm, Pune', isActive: true },
            { name: 'Ravi Kumar', email: 'customer@dairy.com', password: 'password123', role: 'customer', phone: '9876543211', address: '12 MG Road, Pune', isActive: true },
            { name: 'Suresh Delivery', email: 'dist@dairy.com', password: 'password123', role: 'distributor', phone: '9876543212', address: 'Kothrud, Pune', isActive: true },
            { name: 'Ramesh Supplier', email: 'supplier@dairy.com', password: 'password123', role: 'supplier', phone: '9876543213', address: 'Hadapsar Farm, Pune', isActive: true },
        ];
        const results = [];
        for (const u of demoUsers) {
            await User.deleteOne({ email: u.email });
            const created = await User.create(u);
            results.push({ email: created.email, role: created.role, isActive: created.isActive });
        }
        res.json({ success: true, message: 'All demo accounts created!', accounts: results });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.get('/debug-user/:email', async(req, res) => {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.json({ found: false, message: 'User does not exist in DB' });
    const match = await bcrypt.compare('password123', user.password);
    res.json({
        found: true,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        passwordMatch: match,
        diagnosis: !match ?
            '❌ PASSWORD HASH IS WRONG' :
            !user.isActive ?
            '❌ isActive IS FALSE - account deactivated' : '✅ Everything correct - check frontend API URL'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

