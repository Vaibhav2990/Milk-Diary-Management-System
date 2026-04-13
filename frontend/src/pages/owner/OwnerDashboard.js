import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function OwnerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(r => setAnalytics(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><span className="spinner"></span></div>;

  const monthlyData = analytics?.monthlyRevenue?.map(m => ({
    name: MONTH_NAMES[(m._id.month - 1)],
    Revenue: Math.round(m.revenue),
    Orders: m.count,
  })) || [];

  const stats = [
    { icon: '📦', label: 'Total Orders', value: analytics?.orders?.total || 0, color: '#2A7C6F' },
    { icon: '⏳', label: 'Pending Orders', value: analytics?.orders?.pending || 0, color: '#D97706' },
    { icon: '✅', label: 'Delivered Orders', value: analytics?.orders?.delivered || 0, color: '#16A34A' },
    { icon: '💰', label: 'Total Revenue', value: `₹${(analytics?.revenue?.total || 0).toLocaleString()}`, color: '#2563EB' },
    { icon: '👤', label: 'Customers', value: analytics?.users?.customers || 0, color: '#7C3AED' },
    { icon: '🚚', label: 'Distributors', value: analytics?.users?.distributors || 0, color: '#DC2626' },
    { icon: '🐄', label: 'Suppliers', value: analytics?.users?.suppliers || 0, color: '#059669' },
    { icon: '🥛', label: 'Total Supply (L)', value: `${(analytics?.supply?.totalLitres || 0).toFixed(1)}L`, color: '#0891B2' },
    { icon: '🛍️', label: 'Available Products', value: analytics?.products?.available || 0, color: '#BE185D' },
    { icon: '🔄', label: 'Active Subscriptions', value: analytics?.subscriptions?.active || 0, color: '#7C3AED' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Owner Dashboard</h1>
        <p>Welcome back! Here's your dairy business at a glance.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>📈 Monthly Revenue (Last 6 Months)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v, n) => [n === 'Revenue' ? `₹${v}` : v, n]} />
              <Bar dataKey="Revenue" fill="#2A7C6F" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div className="alert alert-info">
          💡 <strong>Supplier Payment Due:</strong> ₹{(analytics?.revenue?.pendingSupplierPayments || 0).toLocaleString()} pending to suppliers.
        </div>
      </div>
    </div>
  );
}
