import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, getAllUsers } from '../../utils/api';

const STATUSES = ['pending','confirmed','assigned','delivered','cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [actionForm, setActionForm] = useState({ status:'', assignedDistributor:'' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      getAllOrders(statusFilter ? { status: statusFilter } : {}),
      getAllUsers({ role: 'distributor' })
    ]).then(([o, d]) => { setOrders(o.data); setDistributors(d.data); }).finally(() => setLoading(false));
  };
  useEffect(load, [statusFilter]);

  const openAction = (order) => {
    setSelected(order);
    setActionForm({ status: order.status, assignedDistributor: order.assignedDistributor?._id || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await updateOrderStatus(selected._id, actionForm);
      load(); setSelected(null);
    } catch (err) { alert(err.response?.data?.message || 'Error updating order'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>View all customer orders, update statuses and assign distributors.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>📦 All Orders ({orders.length})</h3>
        </div>
        <div className="filter-bar">
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>

        {loading ? <div className="loading-center"><span className="spinner"></span></div> :
         orders.length === 0 ? <div className="empty-state"><div className="empty-icon">📦</div><p>No orders found</p></div> :
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Customer</th><th>Items</th><th>Total</th><th>Type</th><th>Status</th><th>Distributor</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>
                    <strong>{o.customer?.name}</strong>
                    <div style={{fontSize:'0.76rem',color:'#6B7280'}}>{o.customer?.phone}</div>
                  </td>
                  <td style={{fontSize:'0.82rem'}}>{o.items?.map(i => `${i.product?.name} ×${i.quantity}`).join(', ')}</td>
                  <td><strong>₹{o.totalAmount}</strong></td>
                  <td><span className="badge badge-confirmed">{o.orderType}</span></td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  <td style={{fontSize:'0.82rem'}}>{o.assignedDistributor?.name || <span style={{color:'#6B7280'}}>Unassigned</span>}</td>
                  <td style={{fontSize:'0.78rem',color:'#6B7280'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td><button className="btn btn-secondary btn-sm" onClick={() => openAction(o)}>⚙️ Update</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚙️ Update Order</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{background:'#F9FAFB',borderRadius:9,padding:'12px 14px',marginBottom:18}}>
              <div style={{fontSize:'0.82rem',color:'#374151'}}><strong>Customer:</strong> {selected.customer?.name}</div>
              <div style={{fontSize:'0.82rem',color:'#374151',marginTop:4}}><strong>Address:</strong> {selected.deliveryAddress}</div>
              <div style={{fontSize:'0.82rem',color:'#374151',marginTop:4}}><strong>Total:</strong> ₹{selected.totalAmount}</div>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Order Status</label>
                <select className="form-control" value={actionForm.status} onChange={e => setActionForm({...actionForm, status:e.target.value})}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign Distributor</label>
                <select className="form-control" value={actionForm.assignedDistributor} onChange={e => setActionForm({...actionForm, assignedDistributor:e.target.value})}>
                  <option value="">-- None --</option>
                  {distributors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.phone || d.email}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Update Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
