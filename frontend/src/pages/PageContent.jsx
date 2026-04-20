import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function PageContent() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [menuSlug, setMenuSlug] = useState('');
  const [menuLabel, setMenuLabel] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/${slug}`)
      .then(res => {
        setPage(res.data);
        return api.get('/menus');
      })
      .then(res => {
        const menus = res.data;
        const parent = menus.find(m =>
          m.slug === slug ||
          m.children?.find(c => c.slug === slug)
        );
        if (parent) {
          setMenuSlug(parent.slug);
          setMenuLabel(parent.label);
        }
      })
      .catch(() => setError('Page introuvable.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 800, margin: '3rem auto', padding: '0 1.5rem' }}>
        <p style={{ color: 'var(--grey-600)' }}>Chargement...</p>
      </div>
    </main>
  );

  if (error || !page) return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 800, margin: '3rem auto', padding: '0 1.5rem' }}>
        <div role="alert" style={{
          background: '#fef1f2', border: '1px solid var(--red-marianne)',
          borderLeft: '4px solid var(--red-marianne)',
          borderRadius: 4, padding: '12px 16px', fontSize: 14, color: '#6e0008'
        }}>
          {error || 'Page introuvable.'}
        </div>
        <Link to="/" style={{ display: 'inline-block', marginTop: 16, color: 'var(--blue-france)', fontWeight: 600 }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  );

  return (
    <main id="main-content" role="main">

      {/* Bandeau titre */}
      <div style={{ background: 'var(--blue-france)', color: 'white', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 8 }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
              <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Accueil</Link></li>
              <li aria-hidden="true">›</li>
              {menuSlug && (
                <>
                  <li>
                    <Link to={`/informations/${menuSlug}`} style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {menuLabel}
                    </Link>
                  </li>
                  <li aria-hidden="true">›</li>
                </>
              )}
              <li aria-current="page" style={{ color: 'white' }}>{page.title}</li>
            </ol>
          </nav>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.75rem' }}>{page.title}</h1>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <article style={{
          background: 'white',
          border: '1px solid var(--grey-200)',
          borderRadius: 4,
          padding: '2rem',

          /* Clé du fix — empêche le débordement */
          minWidth: 0,
          overflow: 'hidden',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}>
          {/* Styles appliqués au contenu HTML injecté */}
          <style>{`
            .page-content { line-height: 1.7; }
            .page-content h2 { font-size: 1.375rem; margin: 1.5rem 0 0.75rem; color: var(--blue-france); }
            .page-content h3 { font-size: 1.125rem; margin: 1.25rem 0 0.5rem; }
            .page-content p { margin: 0 0 1rem; color: var(--grey-900); }
            .page-content ul, .page-content ol { margin: 0 0 1rem 1.5rem; }
            .page-content li { margin-bottom: 0.4rem; }
            .page-content strong { font-weight: 700; }
            .page-content a { color: var(--blue-france); }
            .page-content img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 1rem 0;
            }
            .page-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              overflow-x: auto;
              display: block;
            }
            .page-content td, .page-content th {
              border: 1px solid var(--grey-200);
              padding: 8px 12px;
              text-align: left;
              word-break: break-word;
            }
            .page-content pre, .page-content code {
              background: var(--grey-50);
              border-radius: 4px;
              padding: 2px 6px;
              font-size: 0.875rem;
              white-space: pre-wrap;
              word-break: break-all;
            }
            .page-content blockquote {
              border-left: 4px solid var(--blue-france);
              margin: 1rem 0;
              padding: 0.5rem 1rem;
              background: var(--grey-50);
              color: var(--grey-600);
            }
          `}</style>

          <div
            className="page-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>

        {/* Bouton retour */}
        {menuSlug && (
          <div style={{ marginTop: '1.5rem' }}>
            <Link to={`/informations/${menuSlug}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--blue-france)', fontWeight: 600,
              fontSize: 14, textDecoration: 'underline'
            }}>
              ← Retour à {menuLabel}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}