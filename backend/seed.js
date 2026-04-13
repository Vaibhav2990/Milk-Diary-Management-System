/**
 * Seed Script - Creates demo users and sample products
 * Run: node seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const users = [
  { name: 'Dairy Owner', email: 'owner@dairy.com', password: 'password123', role: 'owner', phone: '9876543210', address: 'Dairy Farm, Pune' },
  { name: 'Ravi Kumar', email: 'customer@dairy.com', password: 'password123', role: 'customer', phone: '9876543211', address: '12 MG Road, Pune' },
  { name: 'Suresh Delivery', email: 'dist@dairy.com', password: 'password123', role: 'distributor', phone: '9876543212', address: 'Kothrud, Pune' },
  { name: 'Ramesh Supplier', email: 'supplier@dairy.com', password: 'password123', role: 'supplier', phone: '9876543213', address: 'Hadapsar Farm, Pune' },
];

const products = [
  { name: 'Fresh Cow Milk', category: 'cow_milk', description: 'Pure fresh cow milk, collected daily', pricePerUnit: 55, unit: 'litre', stockQuantity: 200, isAvailable: true },
  { name: 'Buffalo Milk', category: 'buffalo_milk', description: 'Rich, creamy buffalo milk with high fat content', pricePerUnit: 65, unit: 'litre', stockQuantity: 150, isAvailable: true },
  { name: 'Fresh Paneer', category: 'paneer', description: 'Soft homemade paneer, made fresh daily', pricePerUnit: 300, unit: 'kg', stockQuantity: 30, isAvailable: true },
  { name: 'White Butter', category: 'butter', description: 'Traditional white butter (makhan)', pricePerUnit: 450, unit: 'kg', stockQuantity: 20, isAvailable: true },
  { name: 'Pure Ghee', category: 'ghee', description: 'Authentic desi cow ghee', pricePerUnit: 600, unit: 'kg', stockQuantity: 25, isAvailable: true },
  { name: 'Natural Curd', category: 'curd', description: 'Thick natural yogurt / curd', pricePerUnit: 80, unit: 'kg', stockQuantity: 50, isAvailable: true },
  { name: 'Toned Milk Packet', category: 'cow_milk', description: 'Pasteurized toned milk in sealed packets', pricePerUnit: 28, unit: 'packet', stockQuantity: 300, isAvailable: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash passwords
    for (const u of users) {
      u.password = await bcrypt.hash(u.password, 12);
    }
    await User.insertMany(users);
    console.log('👥 Users seeded:', users.length);

    await Product.insertMany(products);
    console.log('🧈 Products seeded:', products.length);

    console.log('\n🎉 Seed complete! Demo accounts:');
    console.log('  Owner:       owner@dairy.com / password123');
    console.log('  Customer:    customer@dairy.com / password123');
    console.log('  Distributor: dist@dairy.com / password123');
    console.log('  Supplier:    supplier@dairy.com / password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
