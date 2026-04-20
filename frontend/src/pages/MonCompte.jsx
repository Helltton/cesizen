import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const labelStyle = { display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 };
const inputStyle = {
  display: 'block', width: '100%', padding: '10px 12px', fontSize: 15,
  border: '2px solid var(--grey-400)', borderRadius: 4,
  fontFamily: 'inherit', background: 'var(--grey-50)'
};
const btnPrimary = {
  padding: '10px 24px', background: 'var(--blue-france)', color: 'white',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
};
const btnSecondary = {
  padding: '10px 24px', background: 'white', color: 'var(--blue-france)',
  border: '1px solid var(--blue-france)', borderRadius: 4, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
};
const btnDanger = {
  padding: '10px 24px', background: 'white', color: '#c00',
  border: '1px solid #c00', borderRadius: 4, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
};
const cardStyle = {
  background: 'white', border: '1px solid var(--grey-200)',
  borderTop: '4px solid var(--blue-france)', borderRadius: 4,
  padding: '1.5rem', marginBottom: '1.5rem'
};

function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

export default function MonCompte() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Charge les infos du profil au montage
  useState(() => {
    api.get('/users/me').then(res => {
      setProfileForm({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      });
    });
  }, []);

  const showProfileSuccess = (msg) => {
    setProfileSuccess(msg); setProfileError('');
    setTimeout(() => setProfileSuccess(''), 3000);
  };
  const showPasswordSuccess = (msg) => {
    setPasswordSuccess(msg); setPasswordError('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  // ── Modifier le profil ──────────────────────────────────────────

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.firstName || !profileForm.lastName) {
      setProfileError('Le prénom et le nom sont obligatoires.');
      return;
    }
    setLoadingProfile(true);
    try {
      await api.put('/users/me', {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName
      });
      showProfileSuccess('Profil mis à jour avec succès.');
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Erreur lors de la mise à jour.');
    } finally {
      setLoadingProfile(false);
    }
  };

  // ── Modifier le mot de passe ────────────────────────────────────

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Tous les champs sont obligatoires.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoadingPassword(true);
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showPasswordSuccess('Mot de passe modifié avec succès.');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Mot de passe actuel incorrect.');
    } finally {
      setLoadingPassword(false);
    }
  };

  // ── Supprimer le compte ─────────────────────────────────────────

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
    if (!confirm('Confirmation finale — toutes vos données seront supprimées définitivement.')) return;
    try {
      await api.delete('/users/me');
      logout();
      navigate('/');
    } catch (err) {
      alert('Erreur lors de la suppression du compte.');
    }
  };

  return (
    <main id="main-content" role="main">

      {/* Bandeau */}
      <div style={{ background: 'var(--blue-france)', color: 'white', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 8 }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Accueil</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: 'white' }}>Mon compte</li>
            </ol>
          </nav>
          <h1 style={{ color: 'white', margin: 0 }}>Mon compte</h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Infos résumé */}
        <div style={{
          background: 'var(--grey-50)', border: '1px solid var(--grey-200)',
          borderRadius: 4, padding: '1rem 1.5rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
        }}>
          <div style={{
            width: 52, height: 52, background: 'var(--blue-france)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>
              {profileForm.firstName?.[0]?.toUpperCase()}{profileForm.lastName?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 2px' }}>
              {profileForm.firstName} {profileForm.lastName}
            </p>
            <p style={{ fontSize: 13, color: 'var(--grey-600)', margin: 0 }}>
              {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/mes-resultats" style={{
              fontSize: 13, color: 'var(--blue-france)',
              fontWeight: 600, textDecoration: 'underline'
            }}>
              Voir mes diagnostics →
            </Link>
          </div>
        </div>

        {/* Section modifier le profil */}
        <section aria-labelledby="profile-title" style={cardStyle}>
          <h2 id="profile-title" style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>
            Modifier mes informations personnelles
          </h2>

          {profileSuccess && (
            <div role="status" aria-live="polite" style={{
              background: '#e3f5e1', border: '1px solid #1a6e1a',
              borderLeft: '4px solid #1a6e1a', borderRadius: 4,
              padding: '10px 14px', marginBottom: '1rem', fontSize: 14, color: '#1a6e1a'
            }}>
              {profileSuccess}
            </div>
          )}
          {profileError && (
            <div role="alert" style={{
              background: '#fef1f2', border: '1px solid var(--red-marianne)',
              borderLeft: '4px solid var(--red-marianne)', borderRadius: 4,
              padding: '10px 14px', marginBottom: '1rem', fontSize: 14, color: '#6e0008'
            }}>
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '1rem' }}>
              <div>
                <label htmlFor="firstName" style={labelStyle}>
                  Prénom <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
                </label>
                <input
                  id="firstName" type="text" autoComplete="given-name"
                  value={profileForm.firstName}
                  onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                  required aria-required="true" style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="lastName" style={labelStyle}>
                  Nom <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
                </label>
                <input
                  id="lastName" type="text" autoComplete="family-name"
                  value={profileForm.lastName}
                  onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                  required aria-required="true" style={inputStyle}
                />
              </div>
            </div>
            <button type="submit" style={btnPrimary} disabled={loadingProfile}>
              {loadingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </section>

        {/* Section modifier le mot de passe */}
        <section aria-labelledby="password-title" style={cardStyle}>
          <h2 id="password-title" style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>
            Modifier mon mot de passe
          </h2>

          {passwordSuccess && (
            <div role="status" aria-live="polite" style={{
              background: '#e3f5e1', border: '1px solid #1a6e1a',
              borderLeft: '4px solid #1a6e1a', borderRadius: 4,
              padding: '10px 14px', marginBottom: '1rem', fontSize: 14, color: '#1a6e1a'
            }}>
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div role="alert" style={{
              background: '#fef1f2', border: '1px solid var(--red-marianne)',
              borderLeft: '4px solid var(--red-marianne)', borderRadius: 4,
              padding: '10px 14px', marginBottom: '1rem', fontSize: 14, color: '#6e0008'
            }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} noValidate>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="currentPassword" style={labelStyle}>
                Mot de passe actuel <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input
                id="currentPassword" type="password" autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                required aria-required="true" style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="newPassword" style={labelStyle}>
                Nouveau mot de passe <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input
                id="newPassword" type="password" autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                required aria-required="true" style={inputStyle}
              />
              <p style={{ fontSize: 12, color: 'var(--grey-600)', marginTop: 4 }}>
                Minimum 8 caractères.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="confirmPassword" style={labelStyle}>
                Confirmer le nouveau mot de passe <span aria-hidden="true" style={{ color: 'var(--red-marianne)' }}>*</span>
              </label>
              <input
                id="confirmPassword" type="password" autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required aria-required="true" style={inputStyle}
              />
            </div>
            <button type="submit" style={btnPrimary} disabled={loadingPassword}>
              {loadingPassword ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </section>

        {/* Section danger — supprimer le compte */}
        <section aria-labelledby="danger-title" style={{
          ...cardStyle,
          borderTop: '4px solid #c00'
        }}>
          <h2 id="danger-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#c00' }}>
            Supprimer mon compte
          </h2>
          <p style={{ fontSize: 14, color: 'var(--grey-600)', marginBottom: '1.25rem' }}>
            La suppression de votre compte est définitive. Toutes vos données (diagnostics, résultats) seront effacées et ne pourront pas être récupérées.
          </p>
          <button onClick={handleDeleteAccount} style={btnDanger}>
            Supprimer mon compte définitivement
          </button>
        </section>

      </div>
    </main>
  );
}