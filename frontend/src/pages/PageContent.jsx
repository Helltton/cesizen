import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function PageContent() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [menuSlug, setMenuSlug] = useState('');
  const [menuLabel, setMenuLabel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/pages/${slug}`)
      .then(res => {
        setPage(res.data);
        return api.get('/menus');
      })
      .then(res => {
        const menu = res.data.find(m => m.slug === slug || m.children?.find(c => c.slug === slug));
        if (menu) {
          setMenuSlug(menu.slug);
          setMenuLabel(menu.label);
        }
      })
      .catch(() => setError('Page introuvable'));
  }, [slug]);

  if (error) return <p style={{ padding: '2rem' }}>{error}</p>;
  if (!page) return <p style={{ padding: '2rem' }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>

      {/* Fil d'Ariane */}
      <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#888' }}>Accueil</Link>
        {menuSlug && (
          <> › <Link to={`/informations/${menuSlug}`} style={{ color: '#888' }}>{menuLabel}</Link></>
        )}
        {' '} › {page.title}
      </p>

      <h1 style={{ marginBottom: 24 }}>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />

      {/* Bouton retour */}
      {menuSlug && (
        <Link to={`/informations/${menuSlug}`}
          style={{ display: 'inline-block', marginTop: 32, color: '#2E75B6' }}>
          ← Retour à {menuLabel}
        </Link>
      )}
    </div>
  );
}