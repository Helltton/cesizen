import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function InformationsList() {
  const { slug } = useParams();
  const [menu, setMenu] = useState(null);
  const [allMenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/menus').then(res => {
      const menus = res.data;
      setAllMenus(menus);
      const current = menus.find(m => m.slug === slug);
      setMenu(current || null);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 900, margin: '3rem auto', padding: '0 1.5rem' }}>
        <p style={{ color: 'var(--grey-600)' }}>Chargement...</p>
      </div>
    </main>
  );

  if (!menu) return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 900, margin: '3rem auto', padding: '0 1.5rem' }}>
        <div role="alert" style={{
          background: '#fef1f2', border: '1px solid var(--red-marianne)',
          borderLeft: '4px solid var(--red-marianne)',
          borderRadius: 4, padding: '12px 16px', fontSize: 14, color: '#6e0008'
        }}>
          Section introuvable.
        </div>
        <Link to="/" style={{ display: 'inline-block', marginTop: 16, color: 'var(--blue-france)', fontWeight: 600 }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  );

  return (
    <main id="main-content" role="main">

      {/* Bandeau titre section */}
      <div style={{ background: 'var(--blue-france)', color: 'white', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 8 }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Accueil</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: 'white' }}>{menu.label}</li>
            </ol>
          </nav>
          <h1 style={{ color: 'white', margin: 0 }}>{menu.label}</h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Navigation entre sections */}
        <nav aria-label="Sections" style={{ marginBottom: '2rem' }}>
          <ul style={{ display: 'flex', gap: 8, flexWrap: 'wrap', listStyle: 'none' }}>
            {allMenus.map(m => (
              <li key={m.id}>
                <Link to={`/informations/${m.slug}`} style={{
                  display: 'inline-block', padding: '6px 14px', borderRadius: 4,
                  fontSize: 14, fontWeight: m.slug === slug ? 700 : 400,
                  textDecoration: 'none',
                  background: m.slug === slug ? 'var(--blue-france)' : 'white',
                  color: m.slug === slug ? 'white' : 'var(--blue-france)',
                  border: '1px solid var(--blue-france)'
                }}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page principale du menu */}
        {menu.page && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--grey-600)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12, fontWeight: 600 }}>
              Article principal
            </h2>
            <Link to={`/pages/${menu.slug}`} style={{
              display: 'block', padding: '1.5rem',
              background: 'white', border: '1px solid var(--grey-200)',
              borderLeft: '4px solid var(--blue-france)', borderRadius: 4,
              textDecoration: 'none', color: 'inherit'
            }}>
              <h3 style={{ margin: '0 0 8px', color: 'var(--blue-france)', fontSize: '1.125rem' }}>
                {menu.page.title}
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--grey-600)' }}>
                Lire l'article →
              </p>
            </Link>
          </section>
        )}

        {/* Sous-pages */}
        {menu.children && menu.children.length > 0 && (
          <section>
            <h2 style={{ fontSize: 12, color: 'var(--grey-600)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Articles ({menu.children.length})
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {menu.children.map(child => (
                <li key={child.id}>
                  {child.page ? (
                    <Link to={`/pages/${child.slug}`} style={{
                      display: 'block', padding: '1.25rem 1.5rem',
                      background: 'white', border: '1px solid var(--grey-200)',
                      borderRadius: 4, textDecoration: 'none', color: 'inherit'
                    }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: '1rem', color: 'var(--blue-france)' }}>
                        {child.page.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--grey-600)' }}>
                        {child.page.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                      </p>
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--blue-france)', fontWeight: 600 }}>
                        Lire l'article →
                      </p>
                    </Link>
                  ) : (
                    <div style={{
                      padding: '1.25rem 1.5rem', background: 'var(--grey-50)',
                      border: '1px solid var(--grey-200)', borderRadius: 4
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--grey-400)' }}>
                        {child.label}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--grey-400)' }}>
                        Aucun contenu pour cette sous-page.
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Aucun contenu */}
        {!menu.page && (!menu.children || menu.children.length === 0) && (
          <div style={{
            padding: '3rem', textAlign: 'center',
            background: 'white', border: '1px solid var(--grey-200)', borderRadius: 4
          }}>
            <p style={{ color: 'var(--grey-600)', marginBottom: '1rem' }}>
              Aucun contenu disponible dans cette section pour le moment.
            </p>
            <Link to="/" style={{ color: 'var(--blue-france)', fontWeight: 600, textDecoration: 'underline' }}>
              Retour à l'accueil
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}