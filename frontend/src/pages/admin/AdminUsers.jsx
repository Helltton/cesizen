import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const deactivate = async (id) => {
    await api.patch(`/admin/users/${id}/deactivate`);
    setUsers(users.map(u => u.id === id ? { ...u, isActive: false } : u));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>Gestion des utilisateurs</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Email</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Nom</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Rôle</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Statut</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8 }}>{u.firstName} {u.lastName}</td>
              <td style={{ padding: 8 }}>{u.role}</td>
              <td style={{ padding: 8 }}>{u.isActive ? 'Actif' : 'Inactif'}</td>
              <td style={{ padding: 8 }}>
                {u.isActive && (
                  <button onClick={() => deactivate(u.id)}>Désactiver</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}