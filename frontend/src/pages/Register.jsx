import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const labelStyle = { display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 };
const inputStyle = {
  display: 'block', width: '100%', padding: '10px 12px', fontSize: 16,
  border: '2px solid var(--grey-400)', borderRadius: 4,
  fontFamily: 'inherit', background: 'var(--grey-50)'
};
const btnPrimary = {
  display: 'block', width: '100%', padding: '12px',
  background: 'var(--blue-france)', color: 'white',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 16,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center'
};

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 560, margin: '2rem auto', padding: '0 1rem' }}>

        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Créer un compte</li>
          </ol>
        </nav>

        <div style={{
          background: 'white', border: '1px solid var(--grey-200)',
          borderRadius: 4, padding: 'clamp(1.5rem, 4vw, 2rem)'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Créer un compte</h1>
          <p style={{ color: 'var(--grey-600)', marginBottom: '1.5rem', fontSize: 14 }}>
            Les champs marqués d'un{' '}
            <span style={{ color: 'var(--red-marianne)' }}>*</span> sont obligatoires.
          </p>

          {error && (
            <div role="alert" style={{
              background: '#fef1f2', border: '1px solid var(--red-marianne)',
              borderLeft: '4px solid var(--red-marianne)', borderRadius: 4,
              padding: '12px 16px', marginBottom: '1rem', fontSize: 14, color: '#6e0008'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0 16px'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="firstName" style={labelStyle}>
                  Prénom <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
                </label>
                <input id="firstName" type="text" autoComplete="given-name"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  required aria-required="true" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="lastName" style={labelStyle}>
                  Nom <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
                </label>
                <input id="lastName" type="text" autoComplete="family-name"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  required aria-required="true" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={labelStyle}>
                Adresse électronique <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input id="email" type="email" autoComplete="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required aria-required="true" style={inputStyle}
                placeholder="nom@exemple.fr" />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={labelStyle}>
                Mot de passe <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input id="password" type="password" autoComplete="new-password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required aria-required="true" style={inputStyle} />
              <p style={{ fontSize: 12, color: 'var(--grey-600)', marginTop: 4 }}>
                Minimum 8 caractères.
              </p>
            </div>

            <button type="submit" style={btnPrimary}>Créer mon compte</button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: 14, textAlign: 'center', color: 'var(--grey-600)' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: 'var(--blue-france)', fontWeight: 600 }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}