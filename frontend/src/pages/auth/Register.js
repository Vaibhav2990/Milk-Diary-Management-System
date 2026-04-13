import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roles = [
  { value: 'customer', label: 'Customer', emoji: '👤', desc: 'Buy milk products' },
  { value: 'distributor', label: 'Distributor', emoji: '🚚', desc: 'Deliver orders' },
  { value: 'supplier', label: 'Supplier', emoji: '🐄', desc: 'Supply milk' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'customer' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    try {
      const user = await register(form);
      const map = { customer: '/customer/dashboard', distributor: '/distributor/dashboard', supplier: '/supplier/dashboard' };
      navigate(map[user.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <span className="logo-emoji">🥛</span>
          <h1>Create Account</h1>
          <p>Join Milk Dairy Management System</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Your Role</label>
            <div className="role-select">
              {roles.map(r => (
                <div key={r.value} className={`role-option${form.role === r.value ? ' selected' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}>
                  <span>{r.emoji}</span>
                  <div style={{ fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 2 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" placeholder="Your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" placeholder="+91 9999999999"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-control" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-control" placeholder="Your delivery address"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <div className="auth-link">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
