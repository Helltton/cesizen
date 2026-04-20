import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const labelStyle = { display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 };
const inputStyle = {
  display: 'block', width: '100%', padding: '10px 12px', fontSize: 16,
  border: '2px solid var(--grey-400)', borderRadius: 4, fontFamily: 'inherit',
  background: 'var(--grey-50)'
};
const btnPrimary = {
  display: 'inline-block', background: 'var(--blue-france)', color: 'white',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 16,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center'
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants incorrects');
    }
  };

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 480, margin: '3rem auto', padding: '0 1.5rem' }}>

        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Connexion</li>
          </ol>
        </nav>

        <div style={{
          background: 'white', border: '1px solid var(--grey-200)',
          borderRadius: 4, padding: '2rem'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connexion</h1>
          <p style={{ color: 'var(--grey-600)', marginBottom: '1.5rem', fontSize: 14 }}>
            Accédez à votre espace personnel CESIZen.
          </p>

          {error && (
            <div role="alert" style={{
              background: '#fef1f2',
              border: '1px solid var(--red-marianne)',
              borderLeft: '4px solid var(--red-marianne)',
              borderRadius: 4, padding: '12px 16px',
              marginBottom: '1rem', fontSize: 14, color: '#6e0008'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={labelStyle}>
                Adresse électronique{' '}
                <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-required="true"
                style={inputStyle}
                placeholder="nom@exemple.fr"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={labelStyle}>
                Mot de passe{' '}
                <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                aria-required="true"
                style={inputStyle}
              />
            </div>

            <button type="submit" style={{ ...btnPrimary, width: '100%', padding: '12px' }}>
              Se connecter
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: 14, textAlign: 'center', color: 'var(--grey-600)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--blue-france)', fontWeight: 600 }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}