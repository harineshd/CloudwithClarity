import { useEffect, useState } from 'react';
import api from '../api';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ full_name: '', date_of_birth: '', phone: '', email: '' });
  const [error, setError] = useState('');

  function load() {
    api.get('/patients').then((res) => setPatients(res.data));
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.full_name || !form.date_of_birth) {
      setError('Full name and date of birth are required');
      return;
    }
    try {
      await api.post('/patients', form);
      setForm({ full_name: '', date_of_birth: '', phone: '', email: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add patient');
    }
  }

  return (
    <div className="main">
      <h1 className="page-title">Patients</h1>
      <p className="page-subtitle">Registered patients on file.</p>

      <div className="card">
        <div className="card-title">Add patient</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Full name</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Date of birth</label>
            <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Phone (optional)</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn" type="submit">Add patient</button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">All patients</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.full_name}</td>
                <td className="timestamp">{p.date_of_birth?.slice(0, 10)}</td>
                <td>{p.phone || '—'}</td>
                <td>{p.email || '—'}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan="4" style={{ color: 'var(--text-muted)' }}>No patients yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
