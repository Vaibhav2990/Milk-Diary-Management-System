import React, { useEffect, useState } from 'react';
import { getMyDeliveries, updateDeliveryStatus } from '../../utils/api';

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState('');

  const load = () => {
    setLoading(true);
    getMyDeliveries(statusFilter ? { status: statusFilter } : {}).then(r => setDeliveries(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, [statusFilter]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { await updateDeliveryStatus(id, { status }); load(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setUpdating(''); }
  };

  const statusColors = { pending:'badge-pending', in_transit:'badge-in_transit', delivered:'badge-delivered', failed:'badge-cancelled' };

  return (
    <div>
      <div className="page-header">
        <h1>My Deliveries</h1>
        <p>View your assigned deliveries and update their status.</p>
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Deliveries</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? <div className="loading-center"><span className="spinner"></span></div> :
       deliveries.length === 0 ? <div className="empty-state"><div className="empty-icon">🚚</div><p>No deliveries found</p></div> :
      <div style={{display:'flex', flexDirection:'column', gap:14}}>
        {deliveries.map(d => (
          <div key={d._id} className="card" style={{padding:'18px 22px'}}>
            <div className="flex-between" style={{marginBottom:10}}>
              <div>
                <strong style={{fontSize:'1rem'}}>{d.customer?.name}</strong>
                <span style={{marginLeft:12}}><span className={`badge ${statusColors[d.status]||'badge-pending'}`}>{d.status?.replace('_',' ')}</span></span>
              </div>
              <div style={{fontSize:'0.8rem',color:'#6B7280'}}>
                📅 {new Date(d.scheduledDate).toLocaleDateString()}
              </div>
            </div>
            <div style={{fontSize:'0.85rem',color:'#374151',marginBottom:10,display:'flex',flexWrap:'wrap',gap:16}}>
              <span>📞 {d.customer?.phone || 'N/A'}</span>
              <span>📍 {d.deliveryAddress}</span>
              {d.route && <span>🗺️ Route: {d.route}</span>}
            </div>
            {d.notes && <div style={{fontSize:'0.82rem',color:'#6B7280',marginBottom:10}}>📝 {d.notes}</div>}
            {d.deliveredAt && <div style={{fontSize:'0.78rem',color:'#16A34A',marginBottom:10}}>✅ Delivered at {new Date(d.deliveredAt).toLocaleString()}</div>}

            {d.status !== 'delivered' && d.status !== 'failed' && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {d.status === 'pending' && (
                  <button className="btn btn-amber btn-sm" disabled={updating===d._id} onClick={() => handleStatus(d._id,'in_transit')}>
                    {updating===d._id ? '...' : '🚗 Start Delivery'}
                  </button>
                )}
                {d.status === 'in_transit' && (
                  <button className="btn btn-primary btn-sm" disabled={updating===d._id} onClick={() => handleStatus(d._id,'delivered')}>
                    {updating===d._id ? '...' : '✅ Mark Delivered'}
                  </button>
                )}
                <button className="btn btn-danger btn-sm" disabled={updating===d._id} onClick={() => handleStatus(d._id,'failed')}>
                  ❌ Mark Failed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>}
    </div>
  );
}
