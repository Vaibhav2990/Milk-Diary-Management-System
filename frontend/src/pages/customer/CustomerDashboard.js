import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, getMySubscriptions } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyOrders(), getMySubscriptions()])
      .then(([o, s]) => { setOrders(o.data); setSubs(s.data); })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon:'📦', label:'Total Orders', value: orders.length, color:'#2A7C6F' },
    { icon:'⏳', label:'Pending Orders', value: orders.filter(o => o.status === 'pending').length, color:'#D97706' },
    { icon:'✅', label:'Delivered', value: orders.filter(o => o.status === 'delivered').length, color:'#16A34A' },
    { icon:'🔄', label:'Active Subscriptions', value: subs.filter(s => s.status === 'active').length, color:'#7C3AED' },
  ];

  const recent = orders.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
        <p>Manage your milk orders and subscriptions easily.</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-value" style={{color:s.color}}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <div className="card-header">
            <h3>🛒 Quick Actions</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <button className="btn btn-primary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/customer/products')}>🛍️ Shop Products</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/customer/orders')}>📦 View My Orders</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/customer/subscriptions')}>🔄 My Subscriptions</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/profile')}>👤 Update Profile</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📋 Recent Orders</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/customer/orders')}>View All</button>
          </div>
          {loading ? <div className="loading-center"><span className="spinner"></span></div> :
           recent.length === 0 ? <div className="empty-state"><div className="empty-icon">📭</div><p>No orders yet. Start shopping!</p></div> :
          <div>
            {recent.map(o => (
              <div key={o._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F3F4F6'}}>
                <div>
                  <div style={{fontSize:'0.85rem', fontWeight:600}}>{o.items?.map(i => i.product?.name).join(', ')}</div>
                  <div style={{fontSize:'0.75rem', color:'#6B7280'}}>{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:600, color:'#2A7C6F'}}>₹{o.totalAmount}</div>
                  <span className={`badge badge-${o.status}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}
