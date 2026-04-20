import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Diagnostic() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/diagnostics/events')
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selected.length) return;
    setSubmitting(true);
    try {
      const res = await api.post('/diagnostics/submit', { selectedEventIds: selected });
      navigate(`/diagnostic/result/${res.data.resultId}`);
    } catch {
      setSubmitting(false);
    }
  };

  const totalScore = events
    .filter(e => selected.includes(e.id))
    .reduce((sum, e) => sum + e.stressPoints, 0);

  return (
    <main id="main-content" role="main">

      {/* Bandeau */}
      <div style={{ background: 'var(--blue-france)', color: 'white', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 8 }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Accueil</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: 'white' }}>Diagnostic de stress</li>
            </ol>
          </nav>
          <h1 style={{ color: 'white', marginBottom: 8 }}>Diagnostic de stress</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 560 }}>
            Cochez les événements que vous avez vécus au cours des 12 derniers mois.
            Le score total indique votre niveau de stress selon l'échelle de Holmes et Rahe.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Info bulle */}
        <div style={{
          background: 'var(--blue-france-light)', border: '1px solid var(--blue-france)',
          borderLeft: '4px solid var(--blue-france)', borderRadius: 4,
          padding: '12px 16px', marginBottom: '2rem', fontSize: 14, color: '#000091'
        }}>
          <strong>Comment ça fonctionne ?</strong> Chaque événement de vie est associé à un nombre de points.
          Plus votre score est élevé, plus votre niveau de stress potentiel est important.
          {!user && (
            <span> <Link to="/register" style={{ color: 'var(--blue-france)', fontWeight: 600 }}>
              Créez un compte
            </Link> pour sauvegarder vos résultats.</span>
          )}
        </div>

        {loading && <p style={{ color: 'var(--grey-600)' }}>Chargement des événements...</p>}

        {!loading && (
          <>
            {/* Liste des événements */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={{
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--grey-900)', marginBottom: '1rem',
                display: 'block', width: '100%'
              }}>
                Événements de vie ({events.length})
              </legend>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {events.map((event) => {
                  const isChecked = selected.includes(event.id);
                  return (
                    <label
                      key={event.id}
                      htmlFor={`event-${event.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '14px 16px',
                        background: isChecked ? 'var(--blue-france-light)' : 'white',
                        border: isChecked
                          ? '2px solid var(--blue-france)'
                          : '2px solid var(--grey-200)',
                        borderRadius: 6, cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Case à cocher custom */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <input
                          id={`event-${event.id}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(event.id)}
                          style={{
                            position: 'absolute', opacity: 0,
                            width: '100%', height: '100%',
                            cursor: 'pointer', margin: 0
                          }}
                        />
                        <div style={{
                          width: 22, height: 22, borderRadius: 4,
                          border: isChecked ? '2px solid var(--blue-france)' : '2px solid var(--grey-400)',
                          background: isChecked ? 'var(--blue-france)' : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s ease', flexShrink: 0
                        }}>
                          {isChecked && (
                            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                              <path d="M1 5L5 9L12 1" stroke="white" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Label de l'événement */}
                      <span style={{
                        flex: 1, fontSize: 15,
                        fontWeight: isChecked ? 600 : 400,
                        color: isChecked ? 'var(--blue-france)' : 'var(--grey-900)',
                        lineHeight: 1.4
                      }}>
                        {event.label}
                      </span>

                      {/* Badge points */}
                      <span style={{
                        flexShrink: 0, padding: '4px 10px',
                        borderRadius: 20, fontSize: 13, fontWeight: 700,
                        background: isChecked ? 'var(--blue-france)' : 'var(--grey-100)',
                        color: isChecked ? 'white' : 'var(--grey-600)',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap'
                      }}>
                        {event.stressPoints} pts
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Barre de récapitulatif fixe en bas */}
            <div style={{
              position: 'sticky', bottom: 0, left: 0, right: 0,
              background: 'white', borderTop: '2px solid var(--grey-200)',
              padding: '1rem', marginTop: '2rem',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
              zIndex: 10
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--grey-600)' }}>
                  {selected.length} événement{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
                </p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--blue-france)' }}>
                  Score actuel : {totalScore} pts
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {selected.length > 0 && (
                  <button
                    onClick={() => setSelected([])}
                    style={{
                      padding: '10px 20px', background: 'white',
                      color: 'var(--grey-600)', border: '1px solid var(--grey-200)',
                      borderRadius: 4, fontSize: 14, cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600
                    }}
                  >
                    Tout effacer
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!selected.length || submitting}
                  style={{
                    padding: '10px 24px',
                    background: selected.length ? 'var(--blue-france)' : 'var(--grey-200)',
                    color: selected.length ? 'white' : 'var(--grey-400)',
                    border: 'none', borderRadius: 4, fontSize: 14,
                    fontWeight: 700, cursor: selected.length ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit', transition: 'all 0.15s ease'
                  }}
                >
                  {submitting ? 'Calcul en cours...' : 'Voir mon résultat →'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}