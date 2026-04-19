import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Diagnostic() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/diagnostics/events').then(res => setEvents(res.data));
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const res = await api.post('/diagnostics/submit', { selectedEventIds: selected });
    navigate(`/diagnostic/result/${res.data.resultId}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>Diagnostic de stress</h1>
      <p>Cochez les événements que vous avez vécus dans les 12 derniers mois :</p>
      {events.map(event => (
        <label key={event.id} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          <input type="checkbox" checked={selected.includes(event.id)}
            onChange={() => toggle(event.id)} style={{ marginRight: 8 }} />
          {event.label} ({event.stressPoints} pts)
        </label>
      ))}
      <button onClick={handleSubmit} disabled={!selected.length}
        style={{ marginTop: 20, padding: '10px 20px' }}>
        Voir mon résultat
      </button>
    </div>
  );
}