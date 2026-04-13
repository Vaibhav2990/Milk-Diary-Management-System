import React, { useEffect, useState } from 'react';
import { getMySupplies } from '../../utils/api';

export default function MySupplies() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMySupplies().then(r => setSupplies(r.data)).finally(() => setLoading(false)); }, []);

  const totalLitres = supplies.reduce((sum, s) => sum + s.quantity, 0);
  const totalEarned = supplies.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPaid = supplies.reduce((sum, s) => sum + s.paidAmount, 0);

  return (
    <div>
      <div className="page-header">
        <h1>My Supply Records</h1>
        <p>View all your milk supply history and payment status.</p>
      </div>

      <div className="stats-grid" style={{marginBottom:24}}>
        <div className="stat-card"><div className="stat-icon">🥛</div><div><div className="stat-value" style={{color:'#2A7C6F'}}>{totalLitres.toFixed(1)}L</div><div className="stat-label">Total Supplied</div></div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div><div className="stat-value" style={{color:'#16A34A'}}>₹{totalEarned.toLocaleString()}</div><div className="stat-label">Total Earned</div></div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div><div className="stat-value" style={{color:'#2563EB'}}>₹{totalPaid.toLocaleString()}</div><div className="stat-label">Total Received</div></div></div>
        <div className="stat-card"><div className="stat-icon">⏳</div><div><div className="stat-value" style={{color:'#D97706'}}>₹{(totalEarned-totalPaid).toLocaleString()}</div><div className="stat-label">Pending</div></div></div>
      </div>

      <div className="card">
        <div className="card-header"><h3>📋 Supply History ({supplies.length})</h3></div>
        {loading ? <div className="loading-center"><span className="spinner"></span></div> :
         supplies.length === 0 ? <div className="empty-state"><div className="empty-icon">🐄</div><p>No supply records yet</p></div> :
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Milk Type</th><th>Qty (L)</th><th>Rate</th><th>Total</th><th>Fat %</th><th>Grade</th><th>Payment</th><th>Paid</th></tr>
            </thead>
            <tbody>
              {supplies.map(s => (
                <tr key={s._id}>
                  <td style={{fontSize:'0.82rem'}}>{new Date(s.supplyDate).toLocaleDateString()}</td>
                  <td style={{textTransform:'capitalize'}}>{s.milkType?.replace('_',' ')}</td>
                  <td><strong>{s.quantity}</strong></td>
                  <td>₹{s.pricePerUnit}</td>
                  <td><strong style={{color:'#2A7C6F'}}>₹{s.totalAmount}</strong></td>
                  <td>{s.fatPercentage ? `${s.fatPercentage}%` : '—'}</td>
                  <td><span className="badge badge-confirmed">Grade {s.quality}</span></td>
                  <td><span className={`badge badge-${s.paymentStatus}`}>{s.paymentStatus}</span></td>
                  <td>₹{s.paidAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}
