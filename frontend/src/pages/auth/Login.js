import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      const map = { owner: '/owner/dashboard', customer: '/customer/dashboard', distributor: '/distributor/dashboard', supplier: '/supplier/dashboard' };
      navigate(map[user.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const demoAccounts = [
    { role: 'Owner', email: 'owner@dairy.com', password: 'password123', emoji: '👑' },
    { role: 'Customer', email: 'customer@dairy.com', password: 'password123', emoji: '👤' },
    { role: 'Distributor', email: 'dist@dairy.com', password: 'password123', emoji: '🚚' },
    { role: 'Supplier', email: 'supplier@dairy.com', password: 'password123', emoji: '🐄' },
  ];

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div className="auth-card">
          <div className="auth-logo">
            <span className="logo-emoji">🥛</span>
            <h1>Milk Dairy</h1>
            <p>Management System</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Signing in...</> : '🔑 Sign In'}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 10, textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Demo Accounts (click to fill)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {demoAccounts.map(acc => (
              <button key={acc.role} onClick={() => setForm({ email: acc.email, password: acc.password })}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#fff', fontFamily: 'DM Sans', fontSize: '0.8rem', textAlign: 'left', transition: 'background 0.18s' }}
                onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
                onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
              >
                <div>{acc.emoji} {acc.role}</div>
                <div style={{ opacity: 0.7, fontSize: '0.72rem' }}>{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
