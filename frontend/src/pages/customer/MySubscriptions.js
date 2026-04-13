import React, { useEffect, useState } from 'react';
import { getMySubscriptions, createSubscription, cancelSubscription, getProducts } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const EMOJI_MAP = { cow_milk:'🐄', buffalo_milk:'🐃', paneer:'🧀', butter:'🧈', ghee:'✨', curd:'🥛', other:'📦' };

export default function MySubscriptions() {
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ product:'', quantity:1, frequency:'daily', deliveryTime:'morning', deliveryAddress: user?.address || '', startDate:'', endDate:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getMySubscriptions(), getProducts({ available: true })])
      .then(([s, p]) => { setSubs(s.data); setProducts(p.data); }).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try { await createSubscription(form); load(); setModal(false); }
    catch (err) { setError(err.response?.data?.message || 'Error creating subscription'); }
    finally { setSaving(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this subscription?')) return;
    await cancelSubscription(id); load();
  };

  const selectedProduct = products.find(p => p._id === form.product);
  const estimatedDaily = selectedProduct ? selectedProduct.pricePerUnit * form.quantity : 0;

  return (
    <div>
      <div className="page-header">
        <h1>My Subscriptions</h1>
        <p>Manage your recurring daily milk delivery subscriptions.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => { setForm({ product:'', quantity:1, frequency:'daily', deliveryTime:'morning', deliveryAddress: user?.address || '', startDate:'', endDate:'' }); setError(''); setModal(true); }}>
          ➕ New Subscription
        </button>
      </div>

      {loading ? <div className="loading-center"><span className="spinner"></span></div> :
       subs.length === 0 ? <div className="empty-state"><div className="empty-icon">🔄</div><p>No subscriptions yet. Set up daily milk delivery!</p></div> :
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {subs.map(sub => (
          <div key={sub._id} className="card" style={{ padding: '18px 22px' }}>
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.6rem' }}>{EMOJI_MAP[sub.product?.category] || '🥛'}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{sub.product?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>{sub.quantity} {sub.product?.unit} / delivery</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', color: '#2A7C6F', fontWeight: 700 }}>₹{sub.totalAmountPerDelivery}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>per delivery</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: '#374151', flexWrap: 'wrap', marginBottom: 10 }}>
              <span>🔁 {sub.frequency}</span>
              <span>⏰ {sub.deliveryTime}</span>
              <span>📅 From {new Date(sub.startDate).toLocaleDateString()}</span>
              {sub.endDate && <span>to {new Date(sub.endDate).toLocaleDateString()}</span>}
              <span>📍 {sub.deliveryAddress}</span>
            </div>
            <div className="flex-between">
              <span className={`badge badge-${sub.status}`}>{sub.status}</span>
              {sub.status === 'active' && (
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(sub._id)}>❌ Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔄 New Subscription</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product *</label>
                <select className="form-control" value={form.product} onChange={e => setForm({...form, product:e.target.value})} required>
                  <option value="">-- Select Product --</option>
                  {products.map(p => <option key={p._id} value={p._id}>{EMOJI_MAP[p.category]} {p.name} — ₹{p.pricePerUnit}/{p.unit}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity per delivery *</label>
                  <input className="form-control" type="number" min="0.5" step="0.5" value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select className="form-control" value={form.frequency} onChange={e => setForm({...form, frequency:e.target.value})}>
                    <option value="daily">Daily</option>
                    <option value="alternate">Alternate Days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Delivery Time</label>
                  <select className="form-control" value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime:e.target.value})}>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input className="form-control" type="date" value={form.startDate} onChange={e => setForm({...form, startDate:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">End Date (optional)</label>
                <input className="form-control" type="date" value={form.endDate} onChange={e => setForm({...form, endDate:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <input className="form-control" value={form.deliveryAddress} onChange={e => setForm({...form, deliveryAddress:e.target.value})} required />
              </div>
              {estimatedDaily > 0 && (
                <div className="alert alert-info" style={{ marginBottom: 0 }}>
                  💰 Estimated cost: <strong>₹{estimatedDaily.toFixed(2)}</strong> per delivery
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Subscribing...' : '🔄 Subscribe'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
