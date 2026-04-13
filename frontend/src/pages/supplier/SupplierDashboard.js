import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySupplies } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function SupplierDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMySupplies().then(r => setSupplies(r.data)).finally(() => setLoading(false)); }, []);

  const totalLitres = supplies.reduce((sum, s) => sum + s.quantity, 0);
  const totalEarned = supplies.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPaid = supplies.reduce((sum, s) => sum + s.paidAmount, 0);
  const pending = totalEarned - totalPaid;
  const recent = supplies.slice(0, 5);

  const stats = [
    { icon:'🥛', label:'Total Supply (L)', value: `${totalLitres.toFixed(1)}L`, color:'#2A7C6F' },
    { icon:'📋', label:'Total Entries', value: supplies.length, color:'#7C3AED' },
    { icon:'💰', label:'Total Earned', value: `₹${totalEarned.toLocaleString()}`, color:'#16A34A' },
    { icon:'⏳', label:'Pending Payment', value: `₹${pending.toLocaleString()}`, color:'#D97706' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Supplier Dashboard</h1>
        <p>Welcome {user?.name?.split(' ')[0]}! Track your milk supply and payments.</p>
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
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <button className="btn btn-primary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/supplier/add-supply')}>➕ Add Supply Entry</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/supplier/supplies')}>📋 View All Supplies</button>
            <button className="btn btn-secondary" style={{justifyContent:'flex-start'}} onClick={() => navigate('/profile')}>👤 Update Profile</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📋 Recent Supplies</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/supplier/supplies')}>View All</button>
          </div>
          {loading ? <div className="loading-center"><span className="spinner"></span></div> :
           recent.length === 0 ? <div className="empty-state"><div className="empty-icon">🐄</div><p>No supply records yet</p></div> :
          recent.map(s => (
            <div key={s._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid #F3F4F6'}}>
              <div>
                <div style={{fontSize:'0.87rem',fontWeight:600,textTransform:'capitalize'}}>{s.milkType?.replace('_',' ')} — {s.quantity}L</div>
                <div style={{fontSize:'0.75rem',color:'#6B7280'}}>{new Date(s.supplyDate).toLocaleDateString()}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700,color:'#2A7C6F'}}>₹{s.totalAmount}</div>
                <span className={`badge badge-${s.paymentStatus}`}>{s.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
