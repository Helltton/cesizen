import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur inscription');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '2rem' }}>
      <h1>Inscription</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Prénom" value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
        <input placeholder="Nom" value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
        <input type="password" placeholder="Mot de passe (8 car. min)" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>S'inscrire</button>
      </form>
      <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </div>
  );
}