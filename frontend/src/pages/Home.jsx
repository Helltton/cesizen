import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    api.get('/menus').then(res => setMenus(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>CESIZen</h1>
      <p>Bienvenue sur la plateforme de santé mentale.</p>
      <nav style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        {menus.map(menu => (
          <Link key={menu.id} to={`/informations/${menu.slug}`}
            style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 8 }}>
            {menu.label}
          </Link>
        ))}
      </nav>
      <Link to="/diagnostic" style={{ display: 'block', marginTop: 32 }}>
        Faire le diagnostic de stress
      </Link>
    </div>
  );
}