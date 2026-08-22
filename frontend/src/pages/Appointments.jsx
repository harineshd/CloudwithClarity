import { useEffect, useState } from 'react';
import api from '../api';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appointment_time: '', reason: '' });
  const [error, setError] = useState('');

  function loadAll() {
    api.get('/appointments').then((res) => setAppointments(res.data));
    api.get('/patients').then((res) => setPatients(res.data));
    api.get('/doctors').then((res) => setDoctors(res.data));
  }

  useEffect(loadAll, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.patient_id || !form.doctor_id || !form.appointment_time) {
      setError('Patient, doctor and time are required');
      return;
    }
    try {
      await api.post('/appointments', form);
      setForm({ patient_id: '', doctor_id: '', appointment_time: '', reason: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not book appointment');
    }
  }

  async function cancel(id) {
    await api.patch(`/appointments/${id}/cancel`);
    loadAll();
  }

  return (
    <div className="main">
      <h1 className="page-title">Appointments</h1>
      <p className="page-subtitle">Book and manage patient appointments.</p>

      <div className="card">
        <div className="card-title">Book appointment</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Patient</label>
            <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}>
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Doctor</label>
            <select value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}>
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Date &amp; time</label>
            <input
              type="datetime-local"
              value={form.appointment_time}
              onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Reason (optional)</label>
            <input
              type="text"
              placeholder="e.g. Follow-up, annual checkup"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn" type="submit">Book appointment</button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Upcoming &amp; past</div>
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td className="timestamp">{new Date(a.appointment_time).toLocaleString()}</td>
                <td>{a.patient_name}</td>
                <td>{a.doctor_name}</td>
                <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                <td>
                  {a.status === 'scheduled' && (
                    <button className="btn text" onClick={() => cancel(a.id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan="5" style={{ color: 'var(--text-muted)' }}>No appointments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
