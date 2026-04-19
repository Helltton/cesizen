import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDiagnostic() {
  const [events, setEvents] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [newEvent, setNewEvent] = useState({ label: '', stressPoints: '' });

  useEffect(() => {
    api.get('/diagnostics/events').then(res => setEvents(res.data));
    api.get('/diagnostics/admin/config').then(res => setConfigs(res.data));
  }, []);

  const addEvent = async () => {
    const res = await api.post('/diagnostics/admin/events', {
      label: newEvent.label,
      stressPoints: parseInt(newEvent.stressPoints)
    });
    setEvents([...events, res.data]);
    setNewEvent({ label: '', stressPoints: '' });
  };

  const deactivate = async (id) => {
    await api.patch(`/diagnostics/admin/events/${id}/deactivate`);
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>Gestion du diagnostic</h1>

      <h2>Événements</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Événement" value={newEvent.label}
          onChange={e => setNewEvent({ ...newEvent, label: e.target.value })} />
        <input type="number" placeholder="Points" value={newEvent.stressPoints}
          onChange={e => setNewEvent({ ...newEvent, stressPoints: e.target.value })} />
        <button onClick={addEvent}>Ajouter</button>
      </div>
      {events.map(e => (
        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span>{e.label} — {e.stressPoints} pts</span>
          <button onClick={() => deactivate(e.id)}>Désactiver</button>
        </div>
      ))}

      <h2 style={{ marginTop: 32 }}>Tranches de score</h2>
      {configs.map(c => (
        <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <strong>{c.resultLabel}</strong> — {c.scoreMin} à {c.scoreMax} pts
          <p style={{ fontSize: 13, color: '#666' }}>{c.description}</p>
        </div>
      ))}
    </div>
  );
}