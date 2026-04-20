import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const labelStyle = { display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 };
const inputStyle = {
  display: 'block', width: '100%', padding: '8px 12px', fontSize: 14,
  border: '2px solid var(--grey-400)', borderRadius: 4,
  fontFamily: 'inherit', background: 'var(--grey-50)'
};
const btnPrimary = {
  padding: '9px 20px', background: 'var(--blue-france)', color: 'white',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
};
const btnSecondary = {
  padding: '7px 14px', background: 'white', color: 'var(--blue-france)',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 13,
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
const thStyle = {
  padding: '10px 12px', textAlign: 'left',
  fontSize: 13, fontWeight: 600, color: 'var(--grey-600)'
};
const cardStyle = {
  background: 'white', border: '1px solid var(--grey-200)',
  borderTop: '4px solid var(--blue-france)', borderRadius: 4,
  padding: '1.5rem', marginBottom: '2rem'
};

const emptyConfig = { resultLabel: '', scoreMin: '', scoreMax: '', description: '' };

export default function AdminDiagnostic() {
  const [events, setEvents] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [newEvent, setNewEvent] = useState({ label: '', stressPoints: '' });
  const [filter, setFilter] = useState('all');

  // État pour l'ajout d'une tranche
  const [newConfig, setNewConfig] = useState(emptyConfig);
  const [showAddConfig, setShowAddConfig] = useState(false);

  // État pour la modification d'une tranche
  const [editingConfig, setEditingConfig] = useState(null);
  const [editForm, setEditForm] = useState(emptyConfig);

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchConfigs();
  }, []);

  const fetchEvents = () => {
    api.get('/diagnostics/admin/events/all').then(res => setEvents(res.data));
  };

  const fetchConfigs = () => {
    api.get('/diagnostics/admin/config').then(res => setConfigs(res.data));
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ── Événements ──────────────────────────────────────────────────────

  const addEvent = async () => {
    if (!newEvent.label || !newEvent.stressPoints) return;
    const res = await api.post('/diagnostics/admin/events', {
      label: newEvent.label,
      stressPoints: parseInt(newEvent.stressPoints)
    });
    setEvents([...events, res.data]);
    setNewEvent({ label: '', stressPoints: '' });
    showSuccess('Événement ajouté avec succès.');
  };

  const deactivate = async (id) => {
    await api.patch(`/diagnostics/admin/events/${id}/deactivate`);
    setEvents(events.map(e => e.id === id ? { ...e, isActive: false } : e));
    showSuccess('Événement désactivé.');
  };

  const reactivate = async (id) => {
    await api.patch(`/diagnostics/admin/events/${id}/activate`);
    setEvents(events.map(e => e.id === id ? { ...e, isActive: true } : e));
    showSuccess('Événement réactivé.');
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'active') return e.isActive;
    if (filter === 'inactive') return !e.isActive;
    return true;
  });

  // ── Tranches de score ────────────────────────────────────────────────

  const addConfig = async () => {
    if (!newConfig.resultLabel || newConfig.scoreMin === '' || newConfig.scoreMax === '' || !newConfig.description) return;
    const res = await api.post('/diagnostics/admin/config', {
      resultLabel: newConfig.resultLabel,
      scoreMin: parseInt(newConfig.scoreMin),
      scoreMax: parseInt(newConfig.scoreMax),
      description: newConfig.description
    });
    setConfigs([...configs, res.data]);
    setNewConfig(emptyConfig);
    setShowAddConfig(false);
    showSuccess('Tranche ajoutée avec succès.');
  };

  const startEdit = (config) => {
    setEditingConfig(config.id);
    setEditForm({
      resultLabel: config.resultLabel,
      scoreMin: config.scoreMin,
      scoreMax: config.scoreMax === 9999 ? '' : config.scoreMax,
      description: config.description
    });
  };

  const cancelEdit = () => {
    setEditingConfig(null);
    setEditForm(emptyConfig);
  };

  const saveEdit = async (id) => {
    await api.put(`/diagnostics/admin/config/${id}`, {
      resultLabel: editForm.resultLabel,
      scoreMin: parseInt(editForm.scoreMin),
      scoreMax: editForm.scoreMax === '' ? 9999 : parseInt(editForm.scoreMax),
      description: editForm.description
    });
    fetchConfigs();
    setEditingConfig(null);
    showSuccess('Tranche modifiée avec succès.');
  };

  const deleteConfig = async (id) => {
    if (!confirm('Supprimer cette tranche ?')) return;
    await api.delete(`/diagnostics/admin/config/${id}`);
    setConfigs(configs.filter(c => c.id !== id));
    showSuccess('Tranche supprimée.');
  };

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Gestion du diagnostic</li>
          </ol>
        </nav>

        <h1 style={{ color: 'var(--blue-france)', marginBottom: '2rem' }}>
          Gestion du diagnostic
        </h1>

        {/* Message de succès */}
        {successMsg && (
          <div role="status" aria-live="polite" style={{
            background: '#e3f5e1', border: '1px solid #1a6e1a',
            borderLeft: '4px solid #1a6e1a', borderRadius: 4,
            padding: '12px 16px', marginBottom: '1.5rem', fontSize: 14, color: '#1a6e1a'
          }}>
            {successMsg}
          </div>
        )}

        {/* ── Ajouter un événement ── */}
        <section aria-labelledby="add-event-title" style={cardStyle}>
          <h2 id="add-event-title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            Ajouter un événement de stress
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
                type="number" min="1" max="100"
                placeholder="Ex : 20"
                value={newEvent.stressPoints}
                onChange={e => setNewEvent({ ...newEvent, stressPoints: e.target.value })}
                style={inputStyle}
              />
            </div>
            <button onClick={addEvent} style={btnPrimary}>Ajouter</button>
          </div>
        </section>

        {/* ── Liste des événements ── */}
        <section aria-labelledby="events-title" style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
            <h2 id="events-title" style={{ fontSize: '1.125rem' }}>
              Événements ({filteredEvents.length})
            </h2>
            <div role="group" aria-label="Filtrer les événements" style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'all', label: 'Tous' },
                { value: 'active', label: 'Actifs' },
                { value: 'inactive', label: 'Désactivés' },
              ].map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  style={{
                    padding: '6px 14px', fontSize: 13, borderRadius: 4,
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontWeight: filter === f.value ? 700 : 400,
                    background: filter === f.value ? 'var(--blue-france)' : 'white',
                    color: filter === f.value ? 'white' : 'var(--blue-france)',
                    border: '1px solid var(--blue-france)',
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}
            aria-label="Liste des événements de stress">
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
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                      fontSize: 12, fontWeight: 600,
                      background: e.isActive ? '#e3f5e1' : '#f5e3e3',
                      color: e.isActive ? '#1a6e1a' : '#6e1a1a'
                    }}>
                      {e.isActive ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {e.isActive ? (
                      <button onClick={() => deactivate(e.id)}
                        aria-label={`Désactiver ${e.label}`} style={btnDanger}>
                        Désactiver
                      </button>
                    ) : (
                      <button onClick={() => reactivate(e.id)}
                        aria-label={`Réactiver ${e.label}`} style={btnSuccess}>
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
        <section aria-labelledby="config-title" style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 id="config-title" style={{ fontSize: '1.125rem' }}>
              Tranches d'interprétation du score
            </h2>
            <button onClick={() => setShowAddConfig(!showAddConfig)} style={btnPrimary}>
              {showAddConfig ? 'Annuler' : '+ Ajouter une tranche'}
            </button>
          </div>

          {/* Formulaire ajout tranche */}
          {showAddConfig && (
            <div style={{
              background: 'var(--grey-50)', border: '1px solid var(--grey-200)',
              borderRadius: 4, padding: '1.5rem', marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nouvelle tranche</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div>
                  <label htmlFor="new-label" style={labelStyle}>Libellé du résultat</label>
                  <input id="new-label" placeholder="Ex : Risque modéré"
                    value={newConfig.resultLabel}
                    onChange={e => setNewConfig({ ...newConfig, resultLabel: e.target.value })}
                    style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="new-min" style={labelStyle}>Score minimum</label>
                  <input id="new-min" type="number" placeholder="Ex : 150"
                    value={newConfig.scoreMin}
                    onChange={e => setNewConfig({ ...newConfig, scoreMin: e.target.value })}
                    style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="new-max" style={labelStyle}>Score maximum (vide = illimité)</label>
                  <input id="new-max" type="number" placeholder="Ex : 299"
                    value={newConfig.scoreMax}
                    onChange={e => setNewConfig({ ...newConfig, scoreMax: e.target.value })}
                    style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="new-desc" style={labelStyle}>Description affichée à l'utilisateur</label>
                <textarea id="new-desc" rows={3}
                  placeholder="Ex : Attention à votre équilibre, des mesures préventives sont recommandées."
                  value={newConfig.description}
                  onChange={e => setNewConfig({ ...newConfig, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={addConfig} style={btnPrimary}>Enregistrer</button>
                <button onClick={() => { setShowAddConfig(false); setNewConfig(emptyConfig); }} style={btnSecondary}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Liste des tranches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {configs.sort((a, b) => a.scoreMin - b.scoreMin).map(c => (
              <div key={c.id} style={{
                border: '1px solid var(--grey-200)', borderRadius: 4,
                overflow: 'hidden'
              }}>
                {editingConfig === c.id ? (
                  /* Formulaire de modification */
                  <div style={{ padding: '1.5rem', background: 'var(--grey-50)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Modifier la tranche</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label htmlFor={`edit-label-${c.id}`} style={labelStyle}>Libellé</label>
                        <input id={`edit-label-${c.id}`}
                          value={editForm.resultLabel}
                          onChange={e => setEditForm({ ...editForm, resultLabel: e.target.value })}
                          style={inputStyle} />
                      </div>
                      <div>
                        <label htmlFor={`edit-min-${c.id}`} style={labelStyle}>Score minimum</label>
                        <input id={`edit-min-${c.id}`} type="number"
                          value={editForm.scoreMin}
                          onChange={e => setEditForm({ ...editForm, scoreMin: e.target.value })}
                          style={inputStyle} />
                      </div>
                      <div>
                        <label htmlFor={`edit-max-${c.id}`} style={labelStyle}>Score maximum (vide = illimité)</label>
                        <input id={`edit-max-${c.id}`} type="number"
                          value={editForm.scoreMax}
                          onChange={e => setEditForm({ ...editForm, scoreMax: e.target.value })}
                          style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor={`edit-desc-${c.id}`} style={labelStyle}>Description</label>
                      <textarea id={`edit-desc-${c.id}`} rows={3}
                        value={editForm.description}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => saveEdit(c.id)} style={btnPrimary}>Enregistrer</button>
                      <button onClick={cancelEdit} style={btnSecondary}>Annuler</button>
                    </div>
                  </div>
                ) : (
                  /* Affichage normal */
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--blue-france)', fontSize: 15 }}>
                          {c.resultLabel}
                        </span>
                        <span style={{
                          fontSize: 12, padding: '2px 10px', borderRadius: 20,
                          background: 'var(--blue-france-light)', color: 'var(--blue-france)', fontWeight: 600
                        }}>
                          {c.scoreMin} – {c.scoreMax === 9999 ? '∞' : c.scoreMax} pts
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--grey-600)', margin: 0 }}>
                        {c.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => startEdit(c)}
                        aria-label={`Modifier la tranche ${c.resultLabel}`}
                        style={btnSecondary}>
                        Modifier
                      </button>
                      <button onClick={() => deleteConfig(c.id)}
                        aria-label={`Supprimer la tranche ${c.resultLabel}`}
                        style={btnDanger}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {configs.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--grey-600)', padding: '2rem' }}>
                Aucune tranche configurée. Ajoutez-en une ci-dessus.
              </p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}