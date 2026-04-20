import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MesResultats() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/diagnostics/my-results')
      .then(res => setResults(res.data))
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score) => {
    if (score < 150) return { bg: '#e3f5e1', color: '#1a6e1a' };
    if (score < 300) return { bg: '#fff3cd', color: '#856404' };
    return { bg: '#f5e3e3', color: '#6e1a1a' };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Mes diagnostics</li>
          </ol>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ color: 'var(--blue-france)' }}>Mes diagnostics</h1>
          <Link to="/diagnostic" style={{
            display: 'inline-block', padding: '10px 20px',
            background: 'var(--blue-france)', color: 'white',
            fontWeight: 700, fontSize: 14, borderRadius: 4, textDecoration: 'none',
            border: '1px solid var(--blue-france)'
          }}>
            Nouveau diagnostic
          </Link>
        </div>

        {loading && <p style={{ color: 'var(--grey-600)' }}>Chargement...</p>}

        {!loading && results.length === 0 && (
          <div style={{
            background: 'white', border: '1px solid var(--grey-200)',
            borderTop: '4px solid var(--blue-france)', borderRadius: 4,
            padding: '3rem', textAlign: 'center'
          }}>
            <p style={{ color: 'var(--grey-600)', marginBottom: '1rem' }}>
              Vous n'avez pas encore effectué de diagnostic.
            </p>
            <Link to="/diagnostic" style={{
              color: 'var(--blue-france)', fontWeight: 600, textDecoration: 'underline'
            }}>
              Faire mon premier diagnostic →
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {results.map((r, i) => {
              const colors = scoreColor(r.totalScore);
              const events = Array.isArray(r.selectedEventIds) ? r.selectedEventIds : [];
              return (
                <article key={r.id} style={{
                  background: 'white', border: '1px solid var(--grey-200)',
                  borderLeft: `4px solid ${colors.color}`,
                  borderRadius: 4, padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--grey-600)', marginBottom: 4 }}>
                        {formatDate(r.takenAt)}
                      </p>
                      <h2 style={{ fontSize: '1.125rem', marginBottom: 8 }}>
                        Diagnostic #{results.length - i}
                      </h2>
                      <p style={{ fontSize: 14, color: 'var(--grey-600)' }}>
                        {events.length} événement{events.length > 1 ? 's' : ''} coché{events.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block', padding: '6px 16px',
                        borderRadius: 20, fontWeight: 700, fontSize: 14,
                        background: colors.bg, color: colors.color,
                        marginBottom: 8
                      }}>
                        {r.interpretation}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: colors.color }}>
                        {r.totalScore} pts
                      </div>
                    </div>
                  </div>

                  {/* Détail des événements cochés */}
                  {events.length > 0 && (
                    <details style={{ marginTop: '1rem' }}>
                      <summary style={{
                        cursor: 'pointer', fontSize: 13, color: 'var(--blue-france)',
                        fontWeight: 600, listStyle: 'none', userSelect: 'none'
                      }}>
                        Voir les événements cochés ({events.length})
                      </summary>
                      <ul style={{
                        marginTop: 8, paddingLeft: 0, listStyle: 'none',
                        display: 'flex', flexDirection: 'column', gap: 4
                      }}>
                        {events.map((e, j) => (
                          <li key={j} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '6px 12px', background: 'var(--grey-50)',
                            borderRadius: 4, fontSize: 13
                          }}>
                            <span>{e.label}</span>
                            <span style={{ fontWeight: 600, color: 'var(--grey-600)' }}>
                              {e.stressPoints} pts
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}