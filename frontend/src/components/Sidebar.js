import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navConfig = {
  owner: [
    { label: 'Dashboard', icon: '📊', path: '/owner/dashboard' },
    { label: 'Products', icon: '🧈', path: '/owner/products' },
    { label: 'Orders', icon: '📦', path: '/owner/orders' },
    { label: 'Deliveries', icon: '🚚', path: '/owner/deliveries' },
    { label: 'Supply Records', icon: '🐄', path: '/owner/supply' },
    { label: 'Manage Users', icon: '👥', path: '/owner/users' },
  ],
  customer: [
    { label: 'Dashboard', icon: '🏠', path: '/customer/dashboard' },
    { label: 'Shop Products', icon: '🛒', path: '/customer/products' },
    { label: 'My Orders', icon: '📦', path: '/customer/orders' },
    { label: 'Subscriptions', icon: '🔄', path: '/customer/subscriptions' },
  ],
  distributor: [
    { label: 'Dashboard', icon: '🏠', path: '/distributor/dashboard' },
    { label: 'My Deliveries', icon: '🚚', path: '/distributor/deliveries' },
  ],
  supplier: [
    { label: 'Dashboard', icon: '🏠', path: '/supplier/dashboard' },
    { label: 'Add Supply', icon: '➕', path: '/supplier/add-supply' },
    { label: 'My Supplies', icon: '📋', path: '/supplier/supplies' },
  ],
};

const roleLabels = { owner: 'Admin / Owner', customer: 'Customer', distributor: 'Distributor', supplier: 'Supplier' };

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = navConfig[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-emoji">🥛</span>
        <h2>Milk Dairy</h2>
        <span>Management System</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
        <div className="nav-section-label" style={{ marginTop: 12 }}>Account</div>
        <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">👤</span> Profile
        </NavLink>
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{roleLabels[user?.role]}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">🚪</button>
      </div>
    </aside>
  );
}
