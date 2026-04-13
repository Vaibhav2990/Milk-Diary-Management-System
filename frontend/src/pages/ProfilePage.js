import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';

const ROLE_INFO = {
  owner: { label: 'Owner / Admin', emoji: '👑', color: '#DC2626' },
  customer: { label: 'Customer', emoji: '👤', color: '#2563EB' },
  distributor: { label: 'Distributor', emoji: '🚚', color: '#7C3AED' },
  supplier: { label: 'Supplier', emoji: '🐄', color: '#059669' },
};

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', password: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roleInfo = ROLE_INFO[user?.role] || {};

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (form.password && form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password && form.password.length < 6) return setError('Password must be at least 6 characters');
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      // Update local storage user name
      const stored = JSON.parse(localStorage.getItem('dairyUser') || '{}');
      stored.name = form.name;
      localStorage.setItem('dairyUser', JSON.stringify(stored));
      setSuccess('✅ Profile updated successfully!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) { setError(err.response?.data?.message || 'Error updating profile'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #2A7C6F, #3A9D8C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', color: '#fff', fontWeight: 700, fontFamily: 'Playfair Display' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h3 style={{ marginBottom: 4 }}>{user?.name}</h3>
          <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 12 }}>{user?.email}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F3F4F6', padding: '6px 14px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, color: roleInfo.color }}>
            {roleInfo.emoji} {roleInfo.label}
          </div>
          {user?.phone && <div style={{ marginTop: 14, fontSize: '0.85rem', color: '#374151' }}>📞 {user.phone}</div>}
          {user?.address && <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#6B7280' }}>📍 {user.address}</div>}
          <div style={{ marginTop: 14, fontSize: '0.76rem', color: '#9CA3AF' }}>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>✏️ Edit Information</h3>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" placeholder="+91 9999999999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" value={user?.email} disabled style={{ background: '#F9FAFB', cursor: 'not-allowed' }} />
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 }}>Email cannot be changed</div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-control" placeholder="Your address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 18, marginTop: 8 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 14, color: '#374151' }}>🔐 Change Password (optional)</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-control" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
