import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/admin')
      .then(res => setUsers(res.data))
      .catch(() => setError('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }, []);

  const deactivate = async (id) => {
    try {
      await api.patch(`/users/admin/${id}/deactivate`);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: false } : u));
    } catch {
      alert('Erreur lors de la désactivation.');
    }
  };

  const reactivate = async (id) => {
    try {
      await api.patch(`/users/admin/${id}/activate`);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: true } : u));
    } catch {
      alert('Erreur lors de la réactivation.');
    }
  };

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Gestion des utilisateurs</li>
          </ol>
        </nav>

        <h1 style={{ color: 'var(--blue-france)', marginBottom: '2rem' }}>
          Gestion des utilisateurs
        </h1>

        {loading && (
          <p style={{ color: 'var(--grey-600)' }}>Chargement...</p>
        )}

        {error && (
          <div role="alert" style={{
            background: '#fef1f2', border: '1px solid var(--red-marianne)',
            borderLeft: '4px solid var(--red-marianne)',
            borderRadius: 4, padding: '12px 16px', marginBottom: '1rem',
            fontSize: 14, color: '#6e0008'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{
            background: 'white', border: '1px solid var(--grey-200)',
            borderTop: '4px solid var(--blue-france)', borderRadius: 4
          }}>
            <table
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}
              aria-label="Liste des utilisateurs"
            >
              <thead>
                <tr style={{ background: 'var(--grey-50)', borderBottom: '2px solid var(--grey-200)' }}>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Email</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Rôle</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Statut</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{
                    borderBottom: '1px solid var(--grey-100)',
                    background: i % 2 === 0 ? 'white' : 'var(--grey-50)',
                    opacity: u.isActive ? 1 : 0.6
                  }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>
                      {u.firstName} {u.lastName}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--grey-600)' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: u.role === 'ADMIN' ? 'var(--blue-france-light)' : 'var(--grey-100)',
                        color: u.role === 'ADMIN' ? 'var(--blue-france)' : 'var(--grey-600)'
                      }}>
                        {u.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: u.isActive ? '#e3f5e1' : '#f5e3e3',
                        color: u.isActive ? '#1a6e1a' : '#6e1a1a'
                      }}>
                        {u.isActive ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {u.role !== 'ADMIN' && (
                        u.isActive ? (
                          <button
                            onClick={() => deactivate(u.id)}
                            aria-label={`Désactiver le compte de ${u.firstName} ${u.lastName}`}
                            style={btnDanger}
                          >
                            Désactiver
                          </button>
                        ) : (
                          <button
                            onClick={() => reactivate(u.id)}
                            aria-label={`Réactiver le compte de ${u.firstName} ${u.lastName}`}
                            style={btnSuccess}
                          >
                            Réactiver
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--grey-600)' }}>
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

const thStyle = {
  padding: '10px 12px', textAlign: 'left',
  fontSize: 13, fontWeight: 600, color: 'var(--grey-600)'
};
const btnDanger = {
  padding: '5px 12px', background: 'white', color: '#c00',
  border: '1px solid #c00', borderRadius: 4, fontSize: 13,
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
};
const btnSuccess = {
  padding: '5px 12px', background: 'white', color: '#1a6e1a',
  border: '1px solid #1a6e1a', borderRadius: 4, fontSize: 13,
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
};