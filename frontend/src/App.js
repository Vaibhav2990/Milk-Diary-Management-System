import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Role Dashboards
import OwnerDashboard from './pages/owner/OwnerDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import DistributorDashboard from './pages/distributor/DistributorDashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';

// Owner Pages
import ManageProducts from './pages/owner/ManageProducts';
import ManageUsers from './pages/owner/ManageUsers';
import ManageOrders from './pages/owner/ManageOrders';
import ManageSupply from './pages/owner/ManageSupply';
import ManageDeliveries from './pages/owner/ManageDeliveries';

// Customer Pages
import ProductsPage from './pages/customer/ProductsPage';
import MyOrders from './pages/customer/MyOrders';
import MySubscriptions from './pages/customer/MySubscriptions';

// Distributor Pages
import MyDeliveries from './pages/distributor/MyDeliveries';

// Supplier Pages
import AddSupply from './pages/supplier/AddSupply';
import MySupplies from './pages/supplier/MySupplies';

// Shared
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const map = { owner: '/owner/dashboard', customer: '/customer/dashboard', distributor: '/distributor/dashboard', supplier: '/supplier/dashboard' };
  return <Navigate to={map[user.role] || '/login'} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />

          {/* Owner */}
          <Route path="/owner/dashboard" element={<PrivateRoute roles={['owner']}><AppLayout><OwnerDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/owner/products" element={<PrivateRoute roles={['owner']}><AppLayout><ManageProducts /></AppLayout></PrivateRoute>} />
          <Route path="/owner/users" element={<PrivateRoute roles={['owner']}><AppLayout><ManageUsers /></AppLayout></PrivateRoute>} />
          <Route path="/owner/orders" element={<PrivateRoute roles={['owner']}><AppLayout><ManageOrders /></AppLayout></PrivateRoute>} />
          <Route path="/owner/supply" element={<PrivateRoute roles={['owner']}><AppLayout><ManageSupply /></AppLayout></PrivateRoute>} />
          <Route path="/owner/deliveries" element={<PrivateRoute roles={['owner']}><AppLayout><ManageDeliveries /></AppLayout></PrivateRoute>} />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<PrivateRoute roles={['customer']}><AppLayout><CustomerDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/customer/products" element={<PrivateRoute roles={['customer']}><AppLayout><ProductsPage /></AppLayout></PrivateRoute>} />
          <Route path="/customer/orders" element={<PrivateRoute roles={['customer']}><AppLayout><MyOrders /></AppLayout></PrivateRoute>} />
          <Route path="/customer/subscriptions" element={<PrivateRoute roles={['customer']}><AppLayout><MySubscriptions /></AppLayout></PrivateRoute>} />

          {/* Distributor */}
          <Route path="/distributor/dashboard" element={<PrivateRoute roles={['distributor']}><AppLayout><DistributorDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/distributor/deliveries" element={<PrivateRoute roles={['distributor']}><AppLayout><MyDeliveries /></AppLayout></PrivateRoute>} />

          {/* Supplier */}
          <Route path="/supplier/dashboard" element={<PrivateRoute roles={['supplier']}><AppLayout><SupplierDashboard /></AppLayout></PrivateRoute>} />
          <Route path="/supplier/add-supply" element={<PrivateRoute roles={['supplier']}><AppLayout><AddSupply /></AppLayout></PrivateRoute>} />
          <Route path="/supplier/supplies" element={<PrivateRoute roles={['supplier']}><AppLayout><MySupplies /></AppLayout></PrivateRoute>} />

          {/* Shared */}
          <Route path="/profile" element={<PrivateRoute><AppLayout><ProfilePage /></AppLayout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
