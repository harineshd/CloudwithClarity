import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('medtrack_user') || '{}');

  function logout() {
    localStorage.removeItem('medtrack_token');
    localStorage.removeItem('medtrack_user');
    navigate('/login');
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">MedTrack</div>
      <div className="sidebar-tag">clinic ops console</div>
      <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        Dashboard
      </NavLink>
      <NavLink to="/appointments" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        Appointments
      </NavLink>
      <NavLink to="/patients" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
        Patients
      </NavLink>
      <div className="sidebar-footer">
        <div>{user.name || 'Staff'}</div>
        <button className="sidebar-link" style={{ marginTop: 8, width: '100%', textAlign: 'left' }} onClick={logout}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
