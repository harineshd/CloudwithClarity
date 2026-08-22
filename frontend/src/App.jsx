import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';

function RequireAuth({ children }) {
  const token = localStorage.getItem('medtrack_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Shell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Shell><Dashboard /></Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/appointments"
        element={
          <RequireAuth>
            <Shell><Appointments /></Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/patients"
        element={
          <RequireAuth>
            <Shell><Patients /></Shell>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
