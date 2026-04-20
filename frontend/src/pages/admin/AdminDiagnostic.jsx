import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDiagnostic() {
  const [events, setEvents] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [newEvent, setNewEvent] = useState({ label: '', stressPoints: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
    api.get('/diagnostics/admin/config').then(res => setConfigs(res.data));
  }, []);

  const fetchEvents = () => {
    api.get('/diagnostics/admin/events/all').then(res => setEvents(res.data));
  };

  const addEvent = async () => {
    if (!newEvent.label || !newEvent.stressPoints) return;
    const res = await api.post('/diagnostics/admin/events', {
      label: newEvent.label,
      stressPoints: parseInt(newEvent.stressPoints)
    });
    setEvents([...events, res.data]);
    setNewEvent({ label: '', stressPoints: '' });
  };

  const deactivate = async (id) => {
    await api.patch(`/diagnostics/admin/events/${id}/deactivate`);
    setEvents(events.map(e => e.id === id ? { ...e, isActive: false } : e));
  };

  const reactivate = async (id) => {
    await api.patch(`/diagnostics/admin/events/${id}/activate`);
    setEvents(events.map(e => e.id === id ? { ...e, isActive: true } : e));
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'active') return e.isActive;
    if (filter === 'inactive') return !e.isActive;
    return true;
  });

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ color: 'var(--blue-france)', marginBottom: '2rem' }}>
          Gestion du diagnostic
        </h1>

        {/* ── Ajouter un événement ── */}
        <section aria-labelledby="add-event-title" style={{
          background: 'white', border: '1px solid var(--grey-200)',
          borderTop: '4px solid var(--blue-france)', borderRadius: 4,
          padding: '1.5rem', marginBottom: '2rem'
        }}>
          <h2 id="add-event-title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            Ajouter un événement
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 200 }}>
              <label htmlFor="event-label" style={labelStyle}>Intitulé de l'événement</label>
              <input
                id="event-label"
                placeholder="Ex : Déménagement"
                value={newEvent.label}
                onChange={e => setNewEvent({ ...newEvent, label: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label htmlFor="event-points" style={labelStyle}>Points de stress</label>
              <input
                id="event-points"
                type="number"
                placeholder="Ex : 20"
                value={newEvent.stressPoints}
                onChange={e => setNewEvent({ ...newEvent, stressPoints: e.target.value })}
                style={inputStyle}
              />
            </div>
            <button onClick={addEvent} style={btnPrimary}>
              Ajouter
            </button>
          </div>
        </section>

        {/* ── Liste des événements ── */}
        <section aria-labelledby="events-title" style={{
          background: 'white', border: '1px solid var(--grey-200)',
          borderTop: '4px solid var(--blue-france)', borderRadius: 4,
          padding: '1.5rem', marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
            <h2 id="events-title" style={{ fontSize: '1.125rem' }}>
              Événements ({filteredEvents.length})
            </h2>

            {/* Filtre actif/inactif */}
            <div role="group" aria-label="Filtrer les événements" style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'all', label: 'Tous' },
                { value: 'active', label: 'Actifs' },
                { value: 'inactive', label: 'Désactivés' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  style={{
                    padding: '6px 14px', fontSize: 13, borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: filter === f.value ? 700 : 400,
                    background: filter === f.value ? 'var(--blue-france)' : 'white',
                    color: filter === f.value ? 'white' : 'var(--blue-france)',
                    border: '1px solid var(--blue-france)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }} aria-label="Liste des événements de stress">
            <thead>
              <tr style={{ background: 'var(--grey-50)', borderBottom: '2px solid var(--grey-200)' }}>
                <th style={thStyle}>Événement</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 100 }}>Points</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 120 }}>Statut</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 140 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((e, i) => (
                <tr key={e.id} style={{
                  borderBottom: '1px solid var(--grey-100)',
                  background: i % 2 === 0 ? 'white' : 'var(--grey-50)',
                  opacity: e.isActive ? 1 : 0.6
                }}>
                  <td style={{ padding: '10px 12px' }}>{e.label}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>
                    {e.stressPoints}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: e.isActive ? '#e3f5e1' : '#f5e3e3',
                      color: e.isActive ? '#1a6e1a' : '#6e1a1a'
                    }}>
                      {e.isActive ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {e.isActive ? (
                      <button
                        onClick={() => deactivate(e.id)}
                        aria-label={`Désactiver l'événement ${e.label}`}
                        style={btnDanger}
                      >
                        Désactiver
                      </button>
                    ) : (
                      <button
                        onClick={() => reactivate(e.id)}
                        aria-label={`Réactiver l'événement ${e.label}`}
                        style={btnSuccess}
                      >
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--grey-600)' }}>
                    Aucun événement dans cette catégorie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ── Tranches de score ── */}
        <section aria-labelledby="config-title" style={{
          background: 'white', border: '1px solid var(--grey-200)',
          borderTop: '4px solid var(--blue-france)', borderRadius: 4, padding: '1.5rem'
        }}>
          <h2 id="config-title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            Tranches d'interprétation du score
          </h2>
          {configs.map(c => (
            <div key={c.id} style={{
              padding: '1rem', borderBottom: '1px solid var(--grey-100)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap'
            }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--blue-france)' }}>{c.resultLabel}</span>
                <span style={{ fontSize: 13, color: 'var(--grey-600)', marginLeft: 12 }}>
                  {c.scoreMin} à {c.scoreMax === 9999 ? '∞' : c.scoreMax} points
                </span>
                <p style={{ fontSize: 13, color: 'var(--grey-600)', marginTop: 4 }}>{c.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

const labelStyle = { display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 };
const inputStyle = {
  display: 'block', width: '100%', padding: '8px 12px', fontSize: 14,
  border: '2px solid var(--grey-400)', borderRadius: 4, fontFamily: 'inherit',
  background: 'var(--grey-50)'
};
const btnPrimary = {
  padding: '9px 20px', background: 'var(--blue-france)', color: 'white',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
};
const btnDanger = {
  padding: '5px 12px', background: 'white', color: '#c00',
  border: '1px solid #c00', borderRadius: 4, fontSize: 13,
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
};
const btnSuccess = {
  padding: '5px 12px', background: 'white', color: '#1a6e1a',
  border: '1px solid #1a6e1a', borderRadius: 4, fontSize: 13,
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
};
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--grey-600)' };