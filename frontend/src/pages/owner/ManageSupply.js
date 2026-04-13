import React, { useEffect, useState } from 'react';
import { getAllSupplies, updatePaymentStatus } from '../../utils/api';

export default function ManageSupply() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [payForm, setPayForm] = useState({ paymentStatus:'paid', paidAmount:'' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllSupplies().then(r => setSupplies(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openPay = (s) => { setSelected(s); setPayForm({ paymentStatus: s.paymentStatus, paidAmount: s.paidAmount }); };

  const handlePay = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await updatePaymentStatus(selected._id, payForm); load(); setSelected(null); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const totalDue = supplies.filter(s => s.paymentStatus !== 'paid').reduce((sum, s) => sum + (s.totalAmount - s.paidAmount), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Supply Records</h1>
        <p>View all milk supply entries and manage supplier payments.</p>
      </div>

      {totalDue > 0 && (
        <div className="alert alert-error" style={{marginBottom:20}}>
          ⚠️ <strong>₹{totalDue.toLocaleString()}</strong> pending payment to suppliers.
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>🐄 All Supply Records ({supplies.length})</h3>
        </div>
        {loading ? <div className="loading-center"><span className="spinner"></span></div> :
         supplies.length === 0 ? <div className="empty-state"><div className="empty-icon">🐄</div><p>No supply records yet</p></div> :
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Supplier</th><th>Type</th><th>Qty</th><th>Rate</th><th>Total</th><th>Quality</th><th>Date</th><th>Payment</th><th>Action</th></tr>
            </thead>
            <tbody>
              {supplies.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.supplier?.name}</strong><div style={{fontSize:'0.76rem',color:'#6B7280'}}>{s.supplier?.email}</div></td>
                  <td style={{textTransform:'capitalize'}}>{s.milkType?.replace('_',' ')}</td>
                  <td>{s.quantity} {s.unit}</td>
                  <td>₹{s.pricePerUnit}</td>
                  <td><strong>₹{s.totalAmount}</strong></td>
                  <td><span className="badge badge-confirmed">Grade {s.quality}</span></td>
                  <td style={{fontSize:'0.78rem',color:'#6B7280'}}>{new Date(s.supplyDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${s.paymentStatus}`}>{s.paymentStatus}</span>
                    {s.paidAmount > 0 && <div style={{fontSize:'0.73rem',color:'#6B7280'}}>Paid: ₹{s.paidAmount}</div>}
                  </td>
                  <td>
                    {s.paymentStatus !== 'paid' && (
                      <button className="btn btn-amber btn-sm" onClick={() => openPay(s)}>💰 Pay</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💰 Update Payment</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{background:'#F9FAFB',borderRadius:9,padding:'12px 14px',marginBottom:18}}>
              <div style={{fontSize:'0.82rem'}}><strong>Supplier:</strong> {selected.supplier?.name}</div>
              <div style={{fontSize:'0.82rem',marginTop:4}}><strong>Total Amount:</strong> ₹{selected.totalAmount}</div>
              <div style={{fontSize:'0.82rem',marginTop:4}}><strong>Already Paid:</strong> ₹{selected.paidAmount}</div>
              <div style={{fontSize:'0.82rem',marginTop:4,color:'#DC2626'}}><strong>Balance Due:</strong> ₹{selected.totalAmount - selected.paidAmount}</div>
            </div>
            <form onSubmit={handlePay}>
              <div className="form-group">
                <label className="form-label">Payment Status</label>
                <select className="form-control" value={payForm.paymentStatus} onChange={e => setPayForm({...payForm,paymentStatus:e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Fully Paid</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount Paid (₹)</label>
                <input className="form-control" type="number" min="0" value={payForm.paidAmount}
                  onChange={e => setPayForm({...payForm, paidAmount:e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Payment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
