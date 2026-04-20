import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DiagnosticResult() {
  const { id } = useParams();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/diagnostics/results/${id}`)
      .then(res => setResult(res.data))
      .catch(() => setError('Résultat introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  const scoreColor = (score) => {
    if (score < 150) return { bg: '#e3f5e1', color: '#1a6e1a', border: '#1a6e1a' };
    if (score < 300) return { bg: '#fff3cd', color: '#856404', border: '#856404' };
    return { bg: '#f5e3e3', color: '#6e1a1a', border: '#6e1a1a' };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <main id="main-content" role="main">
        <div style={{ maxWidth: 700, margin: '3rem auto', padding: '0 1.5rem' }}>
          <p style={{ color: 'var(--grey-600)' }}>Chargement du résultat...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main id="main-content" role="main">
        <div style={{ maxWidth: 700, margin: '3rem auto', padding: '0 1.5rem' }}>
          <div role="alert" style={{
            background: '#fef1f2', border: '1px solid var(--red-marianne)',
            borderLeft: '4px solid var(--red-marianne)',
            borderRadius: 4, padding: '12px 16px', fontSize: 14, color: '#6e0008'
          }}>
            {error || 'Résultat introuvable.'}
          </div>
          <Link to="/diagnostic" style={{
            display: 'inline-block', marginTop: 16,
            color: 'var(--blue-france)', fontWeight: 600, textDecoration: 'underline'
          }}>
            ← Refaire un diagnostic
          </Link>
        </div>
      </main>
    );
  }

  const colors = scoreColor(result.totalScore);
  const events = Array.isArray(result.selectedEventIds) ? result.selectedEventIds : [];

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 700, margin: '3rem auto', padding: '0 1.5rem' }}>

        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link to="/diagnostic" style={{ color: 'var(--blue-france)' }}>Diagnostic</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Résultat</li>
          </ol>
        </nav>

        {/* Carte résultat principal */}
        <div style={{
          background: 'white', border: '1px solid var(--grey-200)',
          borderTop: `4px solid ${colors.border}`, borderRadius: 4,
          padding: '2rem', marginBottom: '1.5rem', textAlign: 'center'
        }}>
          <p style={{ fontSize: 13, color: 'var(--grey-600)', marginBottom: 8 }}>
            Diagnostic du {formatDate(result.takenAt)}
          </p>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            Votre résultat
          </h1>

          {/* Score */}
          <div style={{
            display: 'inline-block', padding: '1.5rem 3rem',
            background: colors.bg, borderRadius: 8, marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: colors.color, lineHeight: 1 }}>
              {result.totalScore}
            </div>
            <div style={{ fontSize: 16, color: colors.color, marginTop: 4 }}>
              points
            </div>
          </div>

          {/* Interprétation */}
          <div style={{
            display: 'inline-block', padding: '8px 24px',
            background: colors.bg, borderRadius: 20,
            fontSize: 18, fontWeight: 700, color: colors.color,
            marginBottom: '1rem'
          }}>
            {result.interpretation}
          </div>

          {/* Message selon le niveau */}
          <p style={{ fontSize: 14, color: 'var(--grey-600)', maxWidth: 480, margin: '0 auto' }}>
            {result.totalScore < 150
              ? 'Votre niveau de stress est faible. Continuez à prendre soin de vous.'
              : result.totalScore < 300
              ? 'Vous êtes dans une période de stress modéré. Pensez à vous accorder du repos.'
              : 'Votre niveau de stress est élevé. Nous vous recommandons de consulter un professionnel de santé.'
            }
          </p>
        </div>

        {/* Événements cochés */}
        {events.length > 0 && (
          <div style={{
            background: 'white', border: '1px solid var(--grey-200)',
            borderRadius: 4, padding: '1.5rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--blue-france)' }}>
              Événements pris en compte ({events.length})
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {events.map((e, i) => (
                <li key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 12px', background: 'var(--grey-50)',
                  borderRadius: 4, fontSize: 14
                }}>
                  <span>{e.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--grey-600)' }}>
                    {e.stressPoints} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Numéro d'urgence si score élevé */}
        {result.totalScore >= 300 && (
          <div style={{
            background: '#fef1f2', border: '1px solid var(--red-marianne)',
            borderLeft: '4px solid var(--red-marianne)',
            borderRadius: 4, padding: '1rem 1.5rem', marginBottom: '1.5rem'
          }}>
            <p style={{ fontSize: 14, color: '#6e0008', margin: 0 }}>
              En cas de détresse psychologique, n'hésitez pas à appeler le{' '}
              <a href="tel:3114" style={{ color: '#6e0008', fontWeight: 700 }}>3114</a>{' '}
              — numéro national de prévention du suicide, disponible 24h/24 7j/7.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/diagnostic" style={{
            display: 'inline-block', padding: '10px 20px',
            background: 'var(--blue-france)', color: 'white',
            fontWeight: 700, fontSize: 14, borderRadius: 4, textDecoration: 'none',
            border: '1px solid var(--blue-france)'
          }}>
            Refaire un diagnostic
          </Link>

          {user && (
            <Link to="/mes-resultats" style={{
              display: 'inline-block', padding: '10px 20px',
              background: 'white', color: 'var(--blue-france)',
              fontWeight: 700, fontSize: 14, borderRadius: 4, textDecoration: 'none',
              border: '1px solid var(--blue-france)'
            }}>
              Voir tous mes diagnostics
            </Link>
          )}

          <Link to="/" style={{
            display: 'inline-block', padding: '10px 20px',
            background: 'white', color: 'var(--grey-600)',
            fontWeight: 600, fontSize: 14, borderRadius: 4, textDecoration: 'none',
            border: '1px solid var(--grey-200)'
          }}>
            Retour à l'accueil
          </Link>
        </div>

      </div>
    </main>
  );
}