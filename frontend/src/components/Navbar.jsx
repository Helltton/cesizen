import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkStyle = (active) => ({
  display: 'block', padding: '10px 16px', fontSize: 15,
  fontWeight: active ? 700 : 400,
  color: active ? 'var(--blue-france)' : 'var(--grey-900)',
  textDecoration: 'none',
  borderBottom: active ? '2px solid var(--blue-france)' : '2px solid transparent',
  whiteSpace: 'nowrap'
});

const mobileLinkStyle = (active) => ({
  display: 'block', padding: '14px 20px', fontSize: 16,
  fontWeight: active ? 700 : 400,
  color: active ? 'var(--blue-france)' : 'var(--grey-900)',
  textDecoration: 'none',
  borderBottom: '1px solid var(--grey-100)',
  background: active ? 'var(--blue-france-light)' : 'white',
});

const btnPrimary = {
  display: 'inline-block', padding: '8px 16px',
  background: 'var(--blue-france)', color: 'white',
  textDecoration: 'none', fontSize: 14, fontWeight: 600,
  border: '1px solid var(--blue-france)', borderRadius: 4,
  cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap'
};

const btnSecondary = {
  display: 'inline-block', padding: '8px 16px',
  background: 'white', color: 'var(--blue-france)',
  textDecoration: 'none', fontSize: 14, fontWeight: 600,
  border: '1px solid var(--blue-france)', borderRadius: 4,
  cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap'
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header role="banner">

      {/* Bandeau Marianne — masqué sur très petit écran */}
      <div style={{
        background: 'var(--blue-france)', color: 'white',
        padding: '6px 0', borderBottom: '2px solid var(--red-marianne)'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1rem',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
            <rect width="8" height="24" fill="#002395"/>
            <rect x="8" width="8" height="24" fill="white"/>
            <rect x="16" width="8" height="24" fill="#ED2939"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600 }}>République Française</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            Liberté · Égalité · Fraternité
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--grey-200)' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 60
        }}>

          {/* Logo */}
          <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: 'var(--blue-france)', padding: '6px 10px',
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img
                src="/cesizen.png"
                alt="CESIZen — Santé mentale et bien-être"
                style={{ height: 36, width: 'auto', display: 'block' }}
              />
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav role="navigation" aria-label="Navigation principale"
            style={{ display: 'none' }}
            className="desktop-nav">
            <ul style={{ display: 'flex', gap: 2, listStyle: 'none', alignItems: 'center' }}>
              <li>
                <Link to="/diagnostic" style={navLinkStyle(location.pathname === '/diagnostic')}>
                  Diagnostic
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/mes-resultats" style={navLinkStyle(location.pathname === '/mes-resultats')}>
                      Mes diagnostics
                    </Link>
                  </li>
                  <li>
                    <Link to="/mon-compte" style={navLinkStyle(location.pathname === '/mon-compte')}>
                      Mon compte
                    </Link>
                  </li>
                </>
              )}
              {user && user.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/users" style={navLinkStyle(location.pathname === '/admin/users')}>
                      Utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/pages" style={navLinkStyle(location.pathname === '/admin/pages')}>
                      Contenus
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/diagnostic" style={navLinkStyle(location.pathname === '/admin/diagnostic')}>
                      Diagnostic admin
                    </Link>
                  </li>
                </>
              )}
              {user ? (
                <li style={{ marginLeft: 8 }}>
                  <button onClick={handleLogout} style={btnSecondary}>Déconnexion</button>
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

          {/* Bouton hamburger — mobile uniquement */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="hamburger-btn"
            style={{
              background: 'none', border: '1px solid var(--grey-200)',
              borderRadius: 4, padding: '8px 10px',
              cursor: 'pointer', display: 'flex',
              flexDirection: 'column', gap: 5, alignItems: 'center'
            }}
          >
            <span style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--grey-900)',
              transition: 'transform 0.2s',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }} />
            <span style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--grey-900)',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s'
            }} />
            <span style={{
              display: 'block', width: 22, height: 2,
              background: 'var(--grey-900)',
              transition: 'transform 0.2s',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }} />
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <nav id="mobile-menu" role="navigation" aria-label="Menu mobile"
            className="mobile-nav"
            style={{
              borderTop: '1px solid var(--grey-200)',
              background: 'white'
            }}>
            <ul style={{ listStyle: 'none' }}>
              <li>
                <Link to="/diagnostic" style={mobileLinkStyle(location.pathname === '/diagnostic')} onClick={closeMenu}>
                  Diagnostic
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/mes-resultats" style={mobileLinkStyle(location.pathname === '/mes-resultats')} onClick={closeMenu}>
                      Mes diagnostics
                    </Link>
                  </li>
                  <li>
                    <Link to="/mon-compte" style={mobileLinkStyle(location.pathname === '/mon-compte')} onClick={closeMenu}>
                      Mon compte
                    </Link>
                  </li>
                </>
              )}
              {user && user.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/users" style={mobileLinkStyle(location.pathname === '/admin/users')} onClick={closeMenu}>
                      Utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/pages" style={mobileLinkStyle(location.pathname === '/admin/pages')} onClick={closeMenu}>
                      Contenus
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/diagnostic" style={mobileLinkStyle(location.pathname === '/admin/diagnostic')} onClick={closeMenu}>
                      Diagnostic admin
                    </Link>
                  </li>
                </>
              )}
              {user ? (
                <li>
                  <button onClick={handleLogout} style={{
                    display: 'block', width: '100%', padding: '14px 20px',
                    fontSize: 16, fontWeight: 600, textAlign: 'left',
                    background: 'white', border: 'none', borderBottom: '1px solid var(--grey-100)',
                    color: 'var(--blue-france)', cursor: 'pointer', fontFamily: 'inherit'
                  }}>
                    Déconnexion
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" style={mobileLinkStyle(location.pathname === '/login')} onClick={closeMenu}>
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" style={{
                      ...mobileLinkStyle(false),
                      background: 'var(--blue-france)', color: 'white',
                      fontWeight: 700
                    }} onClick={closeMenu}>
                      Créer un compte
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>

      {/* CSS responsive via style tag */}
      <style>{`
        .desktop-nav { display: none !important; }
        .hamburger-btn { display: flex !important; }

        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .hamburger-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}