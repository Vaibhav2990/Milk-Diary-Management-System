import React, { useEffect, useState } from 'react';
import { getProducts, createOrder } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const EMOJI_MAP = { cow_milk:'🐄', buffalo_milk:'🐃', paneer:'🧀', butter:'🧈', ghee:'✨', curd:'🥛', other:'📦' };
const CATEGORIES = ['cow_milk','buffalo_milk','paneer','butter','ghee','curd','other'];

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [catFilter, setCatFilter] = useState('');
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ deliveryAddress: user?.address || '', orderType: 'one-time', notes: '', deliveryDate: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { getProducts({ available: true }).then(r => setProducts(r.data)).finally(() => setLoading(false)); }, []);

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(c => { const n = { ...c }; if (n[id] <= 1) delete n[id]; else n[id]--; return n; });
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(p => p._id === id);
    return sum + (p ? p.pricePerUnit * qty : 0);
  }, 0);

  const filtered = products.filter(p =>
    (catFilter === '' || p.category === catFilter) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const placeOrder = async (e) => {
    e.preventDefault(); setError(''); setOrdering(true);
    try {
      const items = Object.entries(cart).map(([product, quantity]) => ({ product, quantity }));
      await createOrder({ items, ...orderForm });
      setSuccess('🎉 Order placed successfully!'); setCart({}); setOrderModal(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Error placing order'); }
    finally { setOrdering(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Shop Products</h1>
        <p>Fresh dairy products delivered to your doorstep.</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Cart summary bar */}
      {cartCount > 0 && (
        <div style={{ background: 'linear-gradient(90deg, #2A7C6F, #3A9D8C)', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', boxShadow: '0 4px 14px rgba(42,124,111,0.3)' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>🛒 {cartCount} items in cart</span>
            <span style={{ marginLeft: 16, opacity: 0.85 }}>₹{cartTotal.toFixed(2)} total</span>
          </div>
          <button className="btn" style={{ background: '#fff', color: '#2A7C6F', fontWeight: 700 }} onClick={() => { setOrderForm(f => ({ ...f, deliveryAddress: user?.address || '' })); setError(''); setOrderModal(true); }}>
            Checkout →
          </button>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {loading ? <div className="loading-center"><span className="spinner"></span></div> :
       filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">🛍️</div><p>No products found</p></div> :
      <div className="products-grid">
        {filtered.map(p => {
          const qty = cart[p._id] || 0;
          return (
            <div key={p._id} className="product-card">
              <div className="product-emoji">{EMOJI_MAP[p.category] || '📦'}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-category">{p.category.replace(/_/g, ' ')}</div>
              <div className="product-price">₹{p.pricePerUnit}<span style={{ fontSize: '0.85rem', color: '#6B7280', fontFamily: 'DM Sans', fontWeight: 400 }}>/{p.unit}</span></div>
              <div className="product-stock">{p.stockQuantity > 0 ? `${p.stockQuantity} ${p.unit} available` : '❌ Out of stock'}</div>
              {p.description && <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 12 }}>{p.description}</div>}

              {p.stockQuantity > 0 ? (
                qty === 0 ? (
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => addToCart(p._id)}>
                    🛒 Add to Cart
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => removeFromCart(p._id)}>−</button>
                    <span style={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>{qty}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => addToCart(p._id)}>+</button>
                  </div>
                )
              ) : (
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled>Out of Stock</button>
              )}
            </div>
          );
        })}
      </div>}

      {orderModal && (
        <div className="modal-overlay" onClick={() => setOrderModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🛒 Place Order</h3>
              <button className="modal-close" onClick={() => setOrderModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Cart summary */}
            <div style={{ background: '#F9FAFB', borderRadius: 9, padding: '14px', marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Order Summary</div>
              {Object.entries(cart).map(([id, qty]) => {
                const p = products.find(p => p._id === id);
                return p ? (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                    <span>{EMOJI_MAP[p.category]} {p.name} × {qty}</span>
                    <span style={{ fontWeight: 600 }}>₹{(p.pricePerUnit * qty).toFixed(2)}</span>
                  </div>
                ) : null;
              })}
              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span><span style={{ color: '#2A7C6F' }}>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={placeOrder}>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <input className="form-control" value={orderForm.deliveryAddress} onChange={e => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })} required placeholder="Enter your full delivery address" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Order Type</label>
                  <select className="form-control" value={orderForm.orderType} onChange={e => setOrderForm({ ...orderForm, orderType: e.target.value })}>
                    <option value="one-time">One-time Order</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Delivery Date</label>
                  <input className="form-control" type="date" value={orderForm.deliveryDate} onChange={e => setOrderForm({ ...orderForm, deliveryDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input className="form-control" placeholder="Any special instructions..." value={orderForm.notes} onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOrderModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={ordering}>{ordering ? 'Placing order...' : `✅ Place Order — ₹${cartTotal.toFixed(2)}`}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
