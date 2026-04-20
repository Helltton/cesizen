import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkStyle = (active) => ({
  display: 'block', padding: '8px 12px', fontSize: 14,
  fontWeight: active ? 700 : 400,
  color: active ? 'var(--blue-france)' : 'var(--grey-900)',
  textDecoration: 'none',
  borderBottom: active ? '2px solid var(--blue-france)' : '2px solid transparent',
});

const btnPrimary = {
  display: 'inline-block', padding: '8px 16px',
  background: 'var(--blue-france)', color: 'white',
  textDecoration: 'none', fontSize: 14, fontWeight: 600,
  border: '1px solid var(--blue-france)', borderRadius: 4,
  cursor: 'pointer', fontFamily: 'inherit'
};

const btnSecondary = {
  display: 'inline-block', padding: '8px 16px',
  background: 'white', color: 'var(--blue-france)',
  textDecoration: 'none', fontSize: 14, fontWeight: 600,
  border: '1px solid var(--blue-france)', borderRadius: 4,
  cursor: 'pointer', fontFamily: 'inherit'
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header role="banner">
      {/* Bandeau Marianne */}
      <div style={{
        background: 'var(--blue-france)', color: 'white',
        padding: '8px 0', borderBottom: '2px solid var(--red-marianne)'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="8" height="24" fill="#002395"/>
            <rect x="8" width="8" height="24" fill="white"/>
            <rect x="16" width="8" height="24" fill="#ED2939"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600 }}>République Française</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginLeft: 8 }}>
            Liberté · Égalité · Fraternité
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--grey-200)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, background: 'var(--blue-france)',
              borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>CZ</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-france)', lineHeight: 1.2 }}>
                CESIZen
              </div>
              <div style={{ fontSize: 11, color: 'var(--grey-600)', lineHeight: 1.2 }}>
                Santé mentale & bien-être
              </div>
            </div>
          </Link>

          <nav role="navigation" aria-label="Navigation principale">
            <ul style={{ display: 'flex', gap: 4, listStyle: 'none', alignItems: 'center' }}>

              {/* Lien diagnostic visible pour tous */}
              <li>
                <Link to="/diagnostic" style={navLinkStyle(location.pathname === '/diagnostic')}>
                  Diagnostic
                </Link>
              </li>

              {/* Lien mes diagnostics uniquement si connecté */}
              {user && (
                <li>
                  <Link to="/mes-resultats" style={navLinkStyle(location.pathname === '/mes-resultats')}>
                    Mes diagnostics
                  </Link>
                </li>
              )}

              {/* Liens admin */}
              {user && user.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/users" style={navLinkStyle(location.pathname === '/admin/users')}>
                      Utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/diagnostic" style={navLinkStyle(location.pathname === '/admin/diagnostic')}>
                      Admin diagnostic
                    </Link>
                  </li>
                </>
              )}

              {/* Boutons connexion / déconnexion */}
              {user ? (
                <li style={{ marginLeft: 8 }}>
                  <button onClick={handleLogout} style={btnSecondary}>
                    Déconnexion
                  </button>
                </li>
              ) : (
                <>
                  <li style={{ marginLeft: 8 }}>
                    <Link to="/login" style={btnSecondary}>Connexion</Link>
                  </li>
                  <li>
                    <Link to="/register" style={btnPrimary}>Créer un compte</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}