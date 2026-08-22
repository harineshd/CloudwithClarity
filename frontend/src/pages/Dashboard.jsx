import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data)).catch(() => {});
    api.get('/health').then((res) => setHealth(res.data)).catch(() => setHealth({ status: 'down' }));
  }, []);

  const isUp = health?.status === 'ok';

  return (
    <div className="main">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        <span className={`health-dot ${isUp ? 'up' : 'down'}`} />
        API tier: {health ? health.status : 'checking…'}
        {health?.db && ` · db ${health.db}`}
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.scheduledAppointments : '—'}</div>
          <div className="stat-label">Scheduled appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.patients : '—'}</div>
          <div className="stat-label">Registered patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats ? stats.doctors : '—'}</div>
          <div className="stat-label">Doctors on staff</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">About this instance</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          This dashboard calls <span className="mono">/api/health</span> and <span className="mono">/api/stats</span> on
          the app tier. When you deploy this behind an ALB, point the target group health check at{' '}
          <span className="mono">/api/health</span> — it verifies both the app process and the DB connection.
        </p>
      </div>
    </div>
  );
}
