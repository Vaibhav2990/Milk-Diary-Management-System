# 🥛 Milk Dairy Management System

<div align="center">

![Milk Dairy](https://img.shields.io/badge/Project-Milk%20Dairy%20Management-2A7C6F?style=for-the-badge&logo=leaflet&logoColor=white)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node](https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

> A complete full-stack web application for managing dairy business operations — orders, deliveries, supply, subscriptions, and analytics — with role-based access control for 4 user types.

<br/>

[🚀 Live Demo](#-live-demo) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Quick Start](#-quick-start) • [📡 API Docs](#-api-documentation) • [🗂️ Folder Structure](#️-folder-structure)

</div>

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | [milk-diary-management-system-amq1.vercel.app](https://milk-diary-management-system-amq1.vercel.app) |
| 🔧 Backend API | [milk-diary-management-system.onrender.com](https://milk-diary-management-system.onrender.com) |

### 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 Owner / Admin | `owner@dairy.com` | `password123` |
| 👤 Customer | `customer@dairy.com` | `password123` |
| 🚚 Distributor | `dist@dairy.com` | `password123` |
| 🐄 Supplier | `supplier@dairy.com` | `password123` |

---

## ✨ Features

### 👑 Owner / Admin
- 📊 Analytics dashboard with monthly revenue bar charts
- 🧈 Full **CRUD** for dairy products (cow milk, paneer, ghee, etc.)
- 📦 View and manage all customer orders — assign distributors, update status
- 👥 Manage all users across every role (create, edit, delete, activate/deactivate)
- 🚚 Schedule deliveries and assign routes to distributors
- 🐄 View all supplier records and update payment status (pending/partial/paid)
- 🔄 View all active customer subscriptions

### 👤 Customer
- 🛒 Browse dairy products with category filter and search
- ➕ Add to cart with quantity controls and instant total calculation
- 📬 Place one-time or subscription-based orders
- 🔄 Set up daily milk delivery subscriptions (daily/alternate/weekly)
- 📋 View complete order history with real-time status tracking
- ❌ Cancel pending orders
- 👤 Update profile and change password

### 🚚 Distributor
- 📅 View all assigned deliveries with schedule and route info
- 🔄 Update delivery status: **Pending → In Transit → Delivered**
- ✅ Completing a delivery auto-closes the linked customer order
- 👤 Profile management

### 🐄 Supplier
- ➕ Log daily milk supply entries (quantity, type, fat%, quality grade)
- 💰 Track payment status from the owner (pending / partial / paid)
- 📋 View complete supply history with earnings summary
- 👤 Profile management

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js 18 | UI rendering |
| **Routing** | React Router v6 | Page navigation |
| **HTTP Client** | Axios | API calls |
| **Charts** | Recharts | Analytics visualizations |
| **Styling** | Custom CSS | Theming (DM Sans + Playfair Display) |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB + Mongoose | Data storage & modeling |
| **Authentication** | JWT + bcryptjs | Secure login & RBAC |
| **Frontend Deploy** | Vercel | Hosting |
| **Backend Deploy** | Render | Hosting |
| **DB Hosting** | MongoDB Atlas | Cloud database |

---

## 🗂️ Folder Structure

```
milk-dairy/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── db.js                   # MongoDB Atlas connection
│   ├── 📁 controllers/
│   │   ├── authController.js       # Register, Login, Profile
│   │   ├── productController.js    # Products CRUD
│   │   ├── orderController.js      # Orders CRUD
│   │   ├── userController.js       # Users CRUD (admin)
│   │   ├── supplyController.js     # Supply CRUD
│   │   ├── deliveryController.js   # Delivery management
│   │   ├── subscriptionController.js # Subscriptions CRUD
│   │   └── analyticsController.js  # Dashboard analytics
│   ├── 📁 middleware/
│   │   └── auth.js                 # JWT verify + role authorization
│   ├── 📁 models/
│   │   ├── User.js                 # User schema (4 roles)
│   │   ├── Product.js              # Product schema
│   │   ├── Order.js                # Order schema
│   │   ├── Subscription.js         # Subscription schema
│   │   ├── Delivery.js             # Delivery schema
│   │   └── Supply.js               # Supply schema
│   ├── 📁 routes/
│   │   ├── auth.js                 # /api/auth
│   │   ├── products.js             # /api/products
│   │   ├── orders.js               # /api/orders
│   │   ├── users.js                # /api/users
│   │   ├── supply.js               # /api/supply
│   │   ├── delivery.js             # /api/delivery
│   │   ├── subscriptions.js        # /api/subscriptions
│   │   └── analytics.js            # /api/analytics
│   ├── server.js                   # Express entry point
│   ├── seed.js                     # Demo data seeder
│   ├── .env.example                # Environment variables template
│   └── package.json
│
└── 📁 frontend/
    ├── 📁 public/
    │   └── index.html
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   └── Sidebar.js           # Dynamic role-based sidebar
    │   ├── 📁 context/
    │   │   └── AuthContext.js       # Global auth state (Context API)
    │   ├── 📁 pages/
    │   │   ├── 📁 auth/
    │   │   │   ├── Login.js
    │   │   │   └── Register.js
    │   │   ├── 📁 owner/
    │   │   │   ├── OwnerDashboard.js
    │   │   │   ├── ManageProducts.js
    │   │   │   ├── ManageOrders.js
    │   │   │   ├── ManageUsers.js
    │   │   │   ├── ManageSupply.js
    │   │   │   └── ManageDeliveries.js
    │   │   ├── 📁 customer/
    │   │   │   ├── CustomerDashboard.js
    │   │   │   ├── ProductsPage.js
    │   │   │   ├── MyOrders.js
    │   │   │   └── MySubscriptions.js
    │   │   ├── 📁 distributor/
    │   │   │   ├── DistributorDashboard.js
    │   │   │   └── MyDeliveries.js
    │   │   ├── 📁 supplier/
    │   │   │   ├── SupplierDashboard.js
    │   │   │   ├── AddSupply.js
    │   │   │   └── MySupplies.js
    │   │   └── ProfilePage.js       # Shared profile (all roles)
    │   ├── 📁 utils/
    │   │   └── api.js               # All Axios API functions
    │   ├── App.js                   # Routes + PrivateRoute logic
    │   ├── index.js                 # React entry point
    │   └── index.css                # Global styles
    ├── .env.example
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) — [Sign up here](https://mongodb.com/atlas)
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/milk-dairy-mern.git
cd milk-dairy-mern/milk-dairy
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/milkdairy
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

> 💡 Get your `MONGO_URI` from MongoDB Atlas → Clusters → Connect → Connect your application

### 3️⃣ Seed Demo Data

```bash
node seed.js
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👥 Users seeded: 4
🧈 Products seeded: 7
🎉 Seed complete!
```

### 4️⃣ Start Backend

```bash
npm run dev
# Server running on http://localhost:5000
```

### 5️⃣ Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6️⃣ Start Frontend

```bash
npm start
# App running on http://localhost:3000
```

### ✅ You're ready!

Open `http://localhost:3000` and login with any demo account.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require the JWT token in the header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 🔐 Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login and get JWT token |
| `GET` | `/auth/profile` | All roles | Get logged-in user profile |
| `PUT` | `/auth/profile` | All roles | Update profile |

#### 🧈 Product Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/products` | All roles | Get all products |
| `GET` | `/products/:id` | All roles | Get single product |
| `POST` | `/products` | Owner | Create product |
| `PUT` | `/products/:id` | Owner | Update product |
| `DELETE` | `/products/:id` | Owner | Delete product |

#### 📦 Order Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/orders` | Customer | Place new order |
| `GET` | `/orders/my` | Customer | Get my orders |
| `GET` | `/orders` | Owner, Distributor | Get all orders |
| `PUT` | `/orders/:id/status` | Owner, Distributor | Update order status |
| `PUT` | `/orders/:id/cancel` | Customer | Cancel order |

#### 🔄 Subscription Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/subscriptions` | Customer | Create subscription |
| `GET` | `/subscriptions/my` | Customer | Get my subscriptions |
| `GET` | `/subscriptions` | Owner | Get all subscriptions |
| `PUT` | `/subscriptions/:id` | Customer | Update subscription |
| `PUT` | `/subscriptions/:id/cancel` | Customer | Cancel subscription |

#### 🐄 Supply Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/supply` | Supplier | Add supply entry |
| `GET` | `/supply/my` | Supplier | Get my supply records |
| `GET` | `/supply` | Owner | Get all supply records |
| `PUT` | `/supply/:id` | Supplier | Update supply entry |
| `PUT` | `/supply/:id/payment` | Owner | Update payment status |

#### 🚚 Delivery Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/delivery/my` | Distributor | Get assigned deliveries |
| `PUT` | `/delivery/:id/status` | Distributor | Update delivery status |
| `POST` | `/delivery` | Owner | Schedule delivery |
| `GET` | `/delivery` | Owner | Get all deliveries |

#### 👥 User Routes (Admin)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/users` | Owner | Get all users |
| `POST` | `/users` | Owner | Create user |
| `GET` | `/users/:id` | Owner | Get user by ID |
| `PUT` | `/users/:id` | Owner | Update user |
| `DELETE` | `/users/:id` | Owner | Delete user |

#### 📊 Analytics Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/analytics` | Owner | Get dashboard analytics |

---

## 🌐 Deployment Guide

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables:
   ```
   MONGO_URI      = your_mongodb_atlas_uri
   JWT_SECRET     = your_jwt_secret
   NODE_ENV       = production
   CLIENT_URL     = https://your-app.vercel.app
   ```
6. Click **Deploy**

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Create React App
4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
5. Click **Deploy**

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Database Access** → Add user with read/write permission
3. **Network Access** → Add IP `0.0.0.0/0` (allow all)
4. **Connect** → Copy connection string → Paste as `MONGO_URI`

---

## 🗃️ Database Schema

```
Users
├── name, email, password (hashed), role
├── phone, address, isActive
└── role: customer | distributor | supplier | owner

Products
├── name, category, description
├── pricePerUnit, unit, stockQuantity
└── isAvailable

Orders
├── customer (ref: User)
├── items: [{ product, quantity, priceAtOrder }]
├── totalAmount, status, deliveryAddress
├── assignedDistributor (ref: User)
└── orderType: one-time | subscription

Subscriptions
├── customer (ref: User), product (ref: Product)
├── quantity, frequency, deliveryTime
├── startDate, endDate, status
└── totalAmountPerDelivery

Deliveries
├── order (ref: Order), distributor (ref: User)
├── customer (ref: User), deliveryAddress
├── scheduledDate, status, route
└── deliveredAt

Supply
├── supplier (ref: User)
├── milkType, quantity, pricePerUnit, totalAmount
├── fatPercentage, quality, supplyDate
└── paymentStatus, paidAmount
```

---

## 🔧 Common Issues & Fixes

### ❌ "Invalid email or password" on demo accounts
```bash
# Hit this URL in your browser while backend is running:
http://localhost:5000/create-all-demo
# Then try logging in again
```

### ❌ Frontend not connecting to backend
Check `frontend/.env` has:
```
REACT_APP_API_URL=http://localhost:5000/api
```
Then **restart** the frontend (`Ctrl+C` then `npm start`).

### ❌ MongoDB connection error
- Ensure `MONGO_URI` in `backend/.env` is correct
- Check MongoDB Atlas → Network Access → IP `0.0.0.0/0` is whitelisted

### ❌ `npm install` fails with ENOENT
You're in the wrong folder. Run:
```bash
cd backend   # for backend
cd frontend  # for frontend
```
Both have their own `package.json`.

---

## 📝 Git Commit Convention

```bash
feat: initialize MERN project structure
feat: add Mongoose models (User, Product, Order, Supply, Delivery, Subscription)
feat: implement JWT authentication with role-based access control
feat: add RESTful API routes for all resources
feat: build React frontend with role-based dashboards
feat: implement cart system and order placement for customers
feat: add daily milk subscription management
feat: add supply logging and payment tracking for suppliers
feat: add delivery status workflow for distributors
feat: build owner analytics dashboard with Recharts
feat: add seed script for demo data
fix: resolve demo login issue (isActive default not applied)
docs: add comprehensive README
```

---

## 👨‍💻 Author

**Vaibhav Choure**
- Roll No: SA148 & SA147
- University: G H Raisoni International Skill Tech University
- Department: School of Engineering & Technology (SOET)
- Subject: Java Programming Skills 
- Guide: Prof. Dashrath Waghmare (Assistant Professor, SOET)

---

## 📄 License

This project is created for educational purposes as part of the Java Proogramming Skills course curriculum.

---

<div align="center">

Made with ❤️ using the MERN Stack

⭐ Star this repo if it helped you!

</div>
