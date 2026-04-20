import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Home() {
  const [menus, setMenus] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/menus').then(res => setMenus(res.data));
  }, []);

  return (
    <main id="main-content" role="main">

      {/* Hero */}
      <div style={{ background: 'var(--blue-france)', color: 'white', padding: 'clamp(2rem, 5vw, 4rem) 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Service public numérique
          </p>
          <h1 style={{ color: 'white', marginBottom: 16, maxWidth: 600 }}>
            Prenez soin de votre santé mentale
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.85)', maxWidth: 560, marginBottom: 32 }}>
            CESIZen vous accompagne pour comprendre et gérer votre stress au quotidien.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/diagnostic" style={{
              display: 'inline-block', padding: '12px 24px',
              background: 'white', color: 'var(--blue-france)',
              fontWeight: 700, fontSize: 16, borderRadius: 4,
              textDecoration: 'none', border: '2px solid white'
            }}>
              Évaluer mon niveau de stress
            </Link>
            {!user && (
              <Link to="/register" style={{
                display: 'inline-block', padding: '12px 24px',
                background: 'transparent', color: 'white',
                fontWeight: 700, fontSize: 16, borderRadius: 4,
                textDecoration: 'none', border: '2px solid white'
              }}>
                Créer un compte
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bandeau urgence */}
      <div style={{ background: 'var(--red-marianne)', color: 'white', padding: '12px 1rem', textAlign: 'center' }}>
        <p style={{ fontSize: 'clamp(12px, 2vw, 14px)', margin: 0 }}>
          En cas de détresse psychologique, appelez le <strong>3114</strong> — disponible 24h/24 7j/7
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) 1rem' }}>

        {/* Nos services */}
        <section aria-labelledby="services-title">
          <h2 id="services-title" style={{ marginBottom: '0.5rem' }}>Nos services</h2>
          <p style={{ color: 'var(--grey-600)', marginBottom: '2rem' }}>
            Des outils gratuits pour mieux comprendre et agir sur votre santé mentale.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20
          }}>

            <article style={cardStyle}>
              <div style={iconBox}><span style={{ fontSize: 24 }}>📋</span></div>
              <h3 style={{ marginBottom: 8 }}>Diagnostic de stress</h3>
              <p style={{ fontSize: 14, color: 'var(--grey-600)', marginBottom: 16 }}>
                Évaluez votre niveau de stress grâce au questionnaire basé sur l'échelle de Holmes et Rahe.
              </p>
              <Link to="/diagnostic" style={linkArrow}>Faire le diagnostic →</Link>
            </article>

            <article style={cardStyle}>
              <div style={iconBox}><span style={{ fontSize: 24 }}>📖</span></div>
              <h3 style={{ marginBottom: 8 }}>Informations</h3>
              <p style={{ fontSize: 14, color: 'var(--grey-600)', marginBottom: 16 }}>
                Accédez à des ressources fiables sur la santé mentale et la prévention.
              </p>
              {menus[0] && (
                <Link to={`/informations/${menus[0].slug}`} style={linkArrow}>
                  Consulter les ressources →
                </Link>
              )}
            </article>

            {!user && (
              <article style={cardStyle}>
                <div style={iconBox}><span style={{ fontSize: 24 }}>👤</span></div>
                <h3 style={{ marginBottom: 8 }}>Espace personnel</h3>
                <p style={{ fontSize: 14, color: 'var(--grey-600)', marginBottom: 16 }}>
                  Créez un compte pour sauvegarder vos résultats et suivre votre évolution.
                </p>
                <Link to="/register" style={linkArrow}>Créer un compte →</Link>
              </article>
            )}

            {user && user.role === 'ADMIN' && (
              <article style={cardStyle}>
                <div style={iconBox}><span style={{ fontSize: 24 }}>⚙️</span></div>
                <h3 style={{ marginBottom: 8 }}>Administration</h3>
                <p style={{ fontSize: 14, color: 'var(--grey-600)', marginBottom: 16 }}>
                  Gérez les utilisateurs, les contenus et la configuration du diagnostic.
                </p>
                <Link to="/admin/users" style={linkArrow}>Accéder à l'administration →</Link>
              </article>
            )}
          </div>
        </section>

        {/* Thématiques */}
        {menus.length > 0 && (
          <section aria-labelledby="infos-title" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <h2 id="infos-title" style={{ marginBottom: '0.5rem' }}>Nos thématiques</h2>
            <p style={{ color: 'var(--grey-600)', marginBottom: '1.5rem' }}>
              Explorez nos pages d'information organisées par thématique.
            </p>
            <ul style={{ display: 'flex', gap: 10, flexWrap: 'wrap', listStyle: 'none' }}>
              {menus.map(menu => (
                <li key={menu.id}>
                  <Link to={`/informations/${menu.slug}`} style={{
                    display: 'inline-block', padding: '8px 16px',
                    border: '1px solid var(--blue-france)', borderRadius: 4,
                    color: 'var(--blue-france)', fontSize: 14, fontWeight: 600,
                    textDecoration: 'none', background: 'white'
                  }}>
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

const cardStyle = {
  background: 'white', border: '1px solid var(--grey-200)',
  borderTop: '4px solid var(--blue-france)', borderRadius: 4, padding: '1.5rem'
};
const iconBox = {
  width: 48, height: 48, background: 'var(--blue-france-light)',
  borderRadius: 8, display: 'flex', alignItems: 'center',
  justifyContent: 'center', marginBottom: 16
};
const linkArrow = {
  color: 'var(--blue-france)', fontWeight: 600, fontSize: 14, textDecoration: 'underline'
};