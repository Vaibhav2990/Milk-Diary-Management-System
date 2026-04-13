import React, { useEffect, useState } from 'react';
import { getAllDeliveries, createDelivery, getAllOrders, getAllUsers } from '../../utils/api';

export default function ManageDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ order:'', distributor:'', customer:'', deliveryAddress:'', scheduledDate:'', route:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getAllDeliveries(), getAllOrders({ status:'confirmed' }), getAllUsers({ role:'distributor' })])
      .then(([d, o, dist]) => { setDeliveries(d.data); setOrders(o.data); setDistributors(dist.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleOrderSelect = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (order) setForm(f => ({ ...f, order: orderId, customer: order.customer?._id, deliveryAddress: order.deliveryAddress }));
    else setForm(f => ({ ...f, order: orderId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try { await createDelivery(form); load(); setModal(false); }
    catch (err) { setError(err.response?.data?.message || 'Error creating delivery'); }
    finally { setSaving(false); }
  };

  const statusColors = { pending:'badge-pending', in_transit:'badge-in_transit', delivered:'badge-delivered', failed:'badge-cancelled' };

  return (
    <div>
      <div className="page-header">
        <h1>Manage Deliveries</h1>
        <p>Schedule deliveries and assign them to distributors.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🚚 All Deliveries ({deliveries.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm({ order:'', distributor:'', customer:'', deliveryAddress:'', scheduledDate:'', route:'' }); setError(''); setModal(true); }}>➕ Schedule Delivery</button>
        </div>

        {loading ? <div className="loading-center"><span className="spinner"></span></div> :
         deliveries.length === 0 ? <div className="empty-state"><div className="empty-icon">🚚</div><p>No deliveries scheduled yet</p></div> :
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Customer</th><th>Distributor</th><th>Address</th><th>Route</th><th>Scheduled</th><th>Status</th><th>Delivered At</th></tr>
            </thead>
            <tbody>
              {deliveries.map(d => (
                <tr key={d._id}>
                  <td><strong>{d.customer?.name}</strong><div style={{fontSize:'0.76rem',color:'#6B7280'}}>{d.customer?.phone}</div></td>
                  <td>{d.distributor?.name || '—'}</td>
                  <td style={{fontSize:'0.82rem',maxWidth:180}}>{d.deliveryAddress}</td>
                  <td style={{fontSize:'0.82rem'}}>{d.route || '—'}</td>
                  <td style={{fontSize:'0.78rem',color:'#6B7280'}}>{new Date(d.scheduledDate).toLocaleDateString()}</td>
                  <td><span className={`badge ${statusColors[d.status] || 'badge-pending'}`}>{d.status?.replace('_',' ')}</span></td>
                  <td style={{fontSize:'0.78rem',color:'#6B7280'}}>{d.deliveredAt ? new Date(d.deliveredAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Schedule Delivery</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Link to Order (optional)</label>
                <select className="form-control" value={form.order} onChange={e => handleOrderSelect(e.target.value)}>
                  <option value="">-- Select Order --</option>
                  {orders.map(o => <option key={o._id} value={o._id}>{o.customer?.name} — ₹{o.totalAmount} ({o.status})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign Distributor *</label>
                <select className="form-control" value={form.distributor} onChange={e => setForm({...form, distributor:e.target.value})} required>
                  <option value="">-- Select Distributor --</option>
                  {distributors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <input className="form-control" value={form.deliveryAddress} onChange={e => setForm({...form, deliveryAddress:e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Scheduled Date *</label>
                  <input className="form-control" type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Route</label>
                  <input className="form-control" placeholder="e.g. Zone A - North" value={form.route} onChange={e => setForm({...form, route:e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Scheduling...' : 'Schedule Delivery'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
