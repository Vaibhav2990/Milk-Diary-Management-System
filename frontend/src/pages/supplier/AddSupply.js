import React, { useState } from 'react';
import { addSupply } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export default function AddSupply() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ milkType:'cow_milk', quantity:'', pricePerUnit:'', supplyDate: new Date().toISOString().split('T')[0], fatPercentage:'', quality:'A', notes:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalAmount = (parseFloat(form.quantity) || 0) * (parseFloat(form.pricePerUnit) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await addSupply({ ...form });
      setSuccess('✅ Supply entry added successfully!');
      setForm({ milkType:'cow_milk', quantity:'', pricePerUnit:'', supplyDate: new Date().toISOString().split('T')[0], fatPercentage:'', quality:'A', notes:'' });
      setTimeout(() => navigate('/supplier/supplies'), 1500);
    } catch (err) { setError(err.response?.data?.message || 'Error adding supply'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add Supply Entry</h1>
        <p>Record today's milk supply to the dairy.</p>
      </div>

      <div className="card" style={{maxWidth:600}}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Milk Type *</label>
              <select className="form-control" value={form.milkType} onChange={e => setForm({...form, milkType:e.target.value})}>
                <option value="cow_milk">🐄 Cow Milk</option>
                <option value="buffalo_milk">🐃 Buffalo Milk</option>
                <option value="mixed">🥛 Mixed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quality Grade</label>
              <select className="form-control" value={form.quality} onChange={e => setForm({...form, quality:e.target.value})}>
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Economy)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity (Litres) *</label>
              <input className="form-control" type="number" min="0" step="0.5" placeholder="e.g. 50" value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price per Litre (₹) *</label>
              <input className="form-control" type="number" min="0" step="0.5" placeholder="e.g. 55" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit:e.target.value})} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Supply Date *</label>
              <input className="form-control" type="date" value={form.supplyDate} onChange={e => setForm({...form, supplyDate:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fat % (optional)</label>
              <input className="form-control" type="number" min="0" max="10" step="0.1" placeholder="e.g. 3.5" value={form.fatPercentage} onChange={e => setForm({...form, fatPercentage:e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input className="form-control" placeholder="Any additional notes..." value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} />
          </div>

          {totalAmount > 0 && (
            <div style={{background:'linear-gradient(90deg,#F0FDF4,#DCFCE7)',borderRadius:10,padding:'14px 18px',marginBottom:18,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:600,color:'#166534'}}>💰 Estimated Payment</span>
              <span style={{fontFamily:'Playfair Display',fontSize:'1.4rem',color:'#16A34A',fontWeight:700}}>₹{totalAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{display:'flex',gap:12}}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/supplier/supplies')}>← Back</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '⏳ Saving...' : '✅ Submit Supply Entry'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
