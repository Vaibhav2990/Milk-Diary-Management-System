# 🥛 Milk Dairy Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for managing a milk dairy business with role-based access control.

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Owner (Admin)** | Full access — products, orders, users, supply, analytics |
| **Customer** | Browse products, place orders, manage subscriptions |
| **Distributor** | View & update assigned delivery status |
| **Supplier** | Log milk supply, track payments |

---

## 🗂️ Project Structure

```
milk-dairy/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── supplyController.js
│   │   ├── deliveryController.js
│   │   ├── subscriptionController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js            # JWT + Role middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Subscription.js
│   │   ├── Delivery.js
│   │   └── Supply.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── supply.js
│   │   ├── delivery.js
│   │   ├── subscriptions.js
│   │   └── analytics.js
│   ├── seed.js                # Demo data seeder
│   ├── server.js              # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Sidebar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.js
    │   │   │   └── Register.js
    │   │   ├── owner/
    │   │   │   ├── OwnerDashboard.js
    │   │   │   ├── ManageProducts.js
    │   │   │   ├── ManageUsers.js
    │   │   │   ├── ManageOrders.js
    │   │   │   ├── ManageSupply.js
    │   │   │   └── ManageDeliveries.js
    │   │   ├── customer/
    │   │   │   ├── CustomerDashboard.js
    │   │   │   ├── ProductsPage.js
    │   │   │   ├── MyOrders.js
    │   │   │   └── MySubscriptions.js
    │   │   ├── distributor/
    │   │   │   ├── DistributorDashboard.js
    │   │   │   └── MyDeliveries.js
    │   │   ├── supplier/
    │   │   │   ├── SupplierDashboard.js
    │   │   │   ├── AddSupply.js
    │   │   │   └── MySupplies.js
    │   │   └── ProfilePage.js
    │   ├── utils/
    │   │   └── api.js          # Axios API calls
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/your-username/milk-dairy-mern.git
cd milk-dairy-mern
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Seed Demo Data
```bash
cd backend
node seed.js
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:5000/api
npm start
```

The app will run at `http://localhost:3000`

---

## 🔑 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@dairy.com | password123 |
| Customer | customer@dairy.com | password123 |
| Distributor | dist@dairy.com | password123 |
| Supplier | supplier@dairy.com | password123 |

---

## 🌐 API Reference

### Base URL: `http://localhost:5000/api`

| Route | Method | Access | Description |
|-------|--------|--------|-------------|
| `/auth/register` | POST | Public | Register user |
| `/auth/login` | POST | Public | Login |
| `/auth/profile` | GET | All | Get own profile |
| `/products` | GET | All | Get products |
| `/products` | POST | Owner | Create product |
| `/products/:id` | PUT | Owner | Update product |
| `/products/:id` | DELETE | Owner | Delete product |
| `/orders` | POST | Customer | Place order |
| `/orders/my` | GET | Customer | My orders |
| `/orders` | GET | Owner/Distributor | All orders |
| `/orders/:id/status` | PUT | Owner/Distributor | Update status |
| `/supply` | POST | Supplier | Add supply |
| `/supply/my` | GET | Supplier | My supplies |
| `/supply` | GET | Owner | All supplies |
| `/supply/:id/payment` | PUT | Owner | Update payment |
| `/delivery/my` | GET | Distributor | My deliveries |
| `/delivery/:id/status` | PUT | Distributor | Update delivery |
| `/delivery` | POST | Owner | Schedule delivery |
| `/subscriptions` | POST | Customer | Subscribe |
| `/subscriptions/my` | GET | Customer | My subscriptions |
| `/analytics` | GET | Owner | Dashboard analytics |
| `/users` | GET/POST | Owner | Manage users |

---

## ☁️ Deployment

### Backend → Render
1. Push code to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set Root Directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend.vercel.app`

### Frontend → Vercel
1. Create project on [vercel.com](https://vercel.com)
2. Set Root Directory: `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user and whitelist all IPs (`0.0.0.0/0`)
3. Copy connection string to `MONGO_URI`

---

## 📝 Suggested Git Commit Messages

```
feat: initialize MERN project structure
feat: add Mongoose models (User, Product, Order, Supply, Delivery, Subscription)
feat: implement JWT authentication with role-based access
feat: add RESTful API routes for all resources
feat: build React frontend with role-based dashboards
feat: add cart system and order placement for customers
feat: implement subscription management for daily deliveries
feat: add supply logging and payment tracking for suppliers
feat: add delivery status update flow for distributors
feat: build owner analytics dashboard with charts
feat: add seed script for demo data
docs: add comprehensive README
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Custom CSS (DM Sans + Playfair Display) |
| Deployment | Vercel (FE), Render (BE), MongoDB Atlas (DB) |

---

## 📄 License
MIT License — Free to use for educational purposes.
