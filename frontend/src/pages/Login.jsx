import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '2rem' }}>
      <h1>Connexion</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
        <input type="password" placeholder="Mot de passe" value={password}
          onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Se connecter</button>
      </form>
      <p>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
    </div>
  );
}