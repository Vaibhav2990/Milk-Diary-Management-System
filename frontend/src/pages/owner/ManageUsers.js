import React, { useEffect, useState } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../utils/api';

const ROLES = ['customer','distributor','supplier','owner'];
const EMPTY = { name:'', email:'', password:'', phone:'', address:'', role:'customer', isActive:true };

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const load = () => {
    setLoading(true);
    getAllUsers(roleFilter ? { role: roleFilter } : {}).then(r => setUsers(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, [roleFilter]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u, password: '' }); setError(''); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) await updateUser(editing._id, form);
      else await createUser(form);
      load(); setModal(false);
    } catch (err) { setError(err.response?.data?.message || 'Error saving user'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await deleteUser(id); load();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View, create, edit, and remove system users across all roles.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>👥 Users ({filtered.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>➕ Add User</button>
        </div>

        <div className="filter-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </select>
        </div>

        {loading ? <div className="loading-center"><span className="spinner"></span></div> :
         filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">👤</div><p>No users found</p></div> :
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? 'badge-active' : 'badge-cancelled'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{fontSize:'0.8rem',color:'#6B7280'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>🗑️</button>
                    </div>
                  </td>
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
              <h3>{editing ? '✏️ Edit User' : '➕ Add User'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input className="form-control" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required={!editing} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-control" value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={e => setForm({...form, address:e.target.value})} />
              </div>
              {editing && (
                <div className="form-group">
                  <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form,isActive:e.target.checked})} />
                    <span className="form-label" style={{margin:0}}>Account Active</span>
                  </label>
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update User' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
