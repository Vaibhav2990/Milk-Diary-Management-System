import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';

const CATEGORIES = ['cow_milk','buffalo_milk','paneer','butter','ghee','curd','other'];
const UNITS = ['litre','kg','gram','piece','packet'];
const EMOJI_MAP = { cow_milk:'🐄', buffalo_milk:'🐃', paneer:'🧀', butter:'🧈', ghee:'✨', curd:'🥛', other:'📦' };
const EMPTY = { name:'', category:'cow_milk', description:'', pricePerUnit:'', unit:'litre', stockQuantity:'', isAvailable:true };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    getProducts().then(r => setProducts(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setError(''); setModal(true); };
  const closeModal = () => setModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) await updateProduct(editing._id, form);
      else await createProduct(form);
      load(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Error saving product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id); load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Manage Products</h1>
        <p>Add, edit, or remove dairy products from the catalog.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🧈 Product Catalog ({products.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>➕ Add Product</button>
        </div>

        <div className="filter-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><span className="spinner"></span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No products found</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Price</th><th>Unit</th><th>Stock</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><strong>{EMOJI_MAP[p.category] || '📦'} {p.name}</strong><div style={{fontSize:'0.76rem',color:'#6B7280'}}>{p.description}</div></td>
                    <td><span className="badge badge-pending" style={{textTransform:'capitalize'}}>{p.category.replace('_',' ')}</span></td>
                    <td><strong>₹{p.pricePerUnit}</strong></td>
                    <td>{p.unit}</td>
                    <td>{p.stockQuantity}</td>
                    <td><span className={`badge ${p.isAvailable ? 'badge-active' : 'badge-cancelled'}`}>{p.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Product' : '➕ Add Product'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-control" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-control" type="number" min="0" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit *</label>
                  <select className="form-control" value={form.unit} onChange={e => setForm({...form, unit:e.target.value})}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-control" type="number" min="0" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity:e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable:e.target.checked})} />
                  <span className="form-label" style={{margin:0}}>Available for sale</span>
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
