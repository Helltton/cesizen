import { Navigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  const payload = parseJwt(token);
  if (payload?.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
}