import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function InformationsList() {
  const { slug } = useParams();
  const [menu, setMenu] = useState(null);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get('/menus').then(res => {
      const allMenus = res.data;
      setMenus(allMenus);
      const current = allMenus.find(m => m.slug === slug);
      setMenu(current);
    });
  }, [slug]);

  if (!menu) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>

      {/* Fil d'Ariane */}
      <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
        <Link to="/">Accueil</Link> › {menu.label}
      </p>

      {/* Titre de la section */}
      <h1 style={{ marginBottom: 8 }}>{menu.label}</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Choisissez un article dans cette section
      </p>

      {/* Navigation entre sections */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {menus.map(m => (
          <Link key={m.id} to={`/informations/${m.slug}`}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid #ccc',
              fontSize: 13,
              background: m.slug === slug ? '#1F3864' : 'white',
              color: m.slug === slug ? 'white' : '#333',
              textDecoration: 'none'
            }}>
            {m.label}
          </Link>
        ))}
      </div>

      {/* Liste des pages de ce menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Page principale du menu */}
        {menu.page && (
          <Link to={`/pages/${menu.slug}`}
            style={{
              display: 'block',
              padding: '20px 24px',
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              textDecoration: 'none',
              color: 'inherit',
              borderLeft: '4px solid #2E75B6'
            }}>
            <h3 style={{ margin: '0 0 8px', color: '#1F3864' }}>{menu.page.title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
              Lire l'article →
            </p>
          </Link>
        )}

        {/* Sous-menus s'il y en a */}
        {menu.children?.map(child => (
          child.page && (
            <Link key={child.id} to={`/pages/${child.slug}`}
              style={{
                display: 'block',
                padding: '20px 24px',
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <h3 style={{ margin: '0 0 8px', color: '#1F3864' }}>{child.page.title}</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
                Lire l'article →
              </p>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}