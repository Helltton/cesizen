import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer role="contentinfo" style={{
      background: 'var(--grey-50)',
      borderTop: '1px solid var(--grey-200)',
      marginTop: '4rem'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--blue-france)' }}>CESIZen</div>
            <p style={{ fontSize: 13, color: 'var(--grey-600)', maxWidth: 280 }}>
              Plateforme publique d'accompagnement à la santé mentale et à la gestion du stress.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Accès rapide</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li><Link to="/" style={{ fontSize: 13, color: 'var(--grey-600)' }}>Accueil</Link></li>
              <li><Link to="/diagnostic" style={{ fontSize: 13, color: 'var(--grey-600)' }}>Diagnostic de stress</Link></li>
              <li><Link to="/register" style={{ fontSize: 13, color: 'var(--grey-600)' }}>Créer un compte</Link></li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Ressources</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li><a href="tel:3114" style={{ fontSize: 13, color: 'var(--grey-600)' }}>3114 — Numéro national prévention suicide</a></li>
              <li><a href="tel:0800858858" style={{ fontSize: 13, color: 'var(--grey-600)' }}>0800 858 858 — Croix-Rouge Écoute</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--grey-200)', paddingTop: '1rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--grey-600)' }}>© 2026 CESIZen — CESI</span>
          <Link to="/" style={{ fontSize: 12, color: 'var(--grey-600)' }}>Accessibilité : non conforme</Link>
          <Link to="/" style={{ fontSize: 12, color: 'var(--grey-600)' }}>Mentions légales</Link>
          <Link to="/" style={{ fontSize: 12, color: 'var(--grey-600)' }}>Données personnelles</Link>
        </div>
      </div>
    </footer>
  );
}