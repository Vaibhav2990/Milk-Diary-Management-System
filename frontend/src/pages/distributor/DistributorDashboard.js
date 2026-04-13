import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDeliveries } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function DistributorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMyDeliveries().then(r => setDeliveries(r.data)).finally(() => setLoading(false)); }, []);

  const today = deliveries.filter(d => {
    const sd = new Date(d.scheduledDate);
    const now = new Date();
    return sd.toDateString() === now.toDateString();
  });

  const stats = [
    { icon:'🚚', label:"Today's Deliveries", value: today.length, color:'#2A7C6F' },
    { icon:'⏳', label:'Pending', value: deliveries.filter(d => d.status === 'pending').length, color:'#D97706' },
    { icon:'✅', label:'Delivered', value: deliveries.filter(d => d.status === 'delivered').length, color:'#16A34A' },
    { icon:'📦', label:'Total Assigned', value: deliveries.length, color:'#7C3AED' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Distributor Dashboard</h1>
        <p>Hello {user?.name?.split(' ')[0]}! Manage your delivery routes.</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div><div className="stat-value" style={{color:s.color}}>{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <div className="card-header"><h3>⚡ Quick Actions</h3></div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <button className="btn btn-primary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/distributor/deliveries')}>🚚 View All Deliveries</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/distributor/deliveries?status=pending')}>⏳ Pending Deliveries</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/profile')}>👤 My Profile</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>📅 Today's Schedule ({today.length})</h3></div>
          {loading ? <div className="loading-center"><span className="spinner"></span></div> :
           today.length === 0 ? <div className="empty-state"><div className="empty-icon">🎉</div><p>No deliveries scheduled today</p></div> :
          today.slice(0, 4).map(d => (
            <div key={d._id} style={{padding:'10px 0',borderBottom:'1px solid #F3F4F6',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600,fontSize:'0.88rem'}}>{d.customer?.name}</div>
                <div style={{fontSize:'0.76rem',color:'#6B7280'}}>{d.deliveryAddress?.substring(0,40)}...</div>
              </div>
              <span className={`badge badge-${d.status}`}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
