import React, { useEffect, useState } from 'react';
import { getMyOrders, cancelOrder } from '../../utils/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => { setLoading(true); getMyOrders().then(r => setOrders(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try { await cancelOrder(id); load(); } catch (err) { alert(err.response?.data?.message || 'Cannot cancel'); }
  };

  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

  return (
    <div>
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track all your dairy product orders.</p>
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Orders</option>
          {['pending','confirmed','assigned','delivered','cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="loading-center"><span className="spinner"></span></div> :
       filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">📦</div><p>No orders found</p></div> :
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(order => (
          <div key={order._id} className="card" style={{ padding: '20px 24px' }}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <div>
                <span className={`badge badge-${order.status}`}>{order.status}</span>
                <span style={{ marginLeft: 10, fontSize: '0.78rem', color: '#6B7280' }}>{order.orderType}</span>
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', color: '#2A7C6F', fontWeight: 700 }}>
                ₹{order.totalAmount}
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem', padding: '5px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>₹{item.priceAtOrder * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 8, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span>📍 {order.deliveryAddress}</span>
              <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
              {order.assignedDistributor && <span>🚚 {order.assignedDistributor.name}</span>}
              {order.notes && <span>📝 {order.notes}</span>}
            </div>

            {['pending', 'confirmed'].includes(order.status) && (
              <div style={{ marginTop: 14 }}>
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(order._id)}>❌ Cancel Order</button>
              </div>
            )}
          </div>
        ))}
      </div>}
    </div>
  );
}
