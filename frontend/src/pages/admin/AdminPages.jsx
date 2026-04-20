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
const cardStyle = {
  background: 'white', border: '1px solid var(--grey-200)',
  borderTop: '4px solid var(--blue-france)', borderRadius: 4,
  padding: '1.5rem', marginBottom: '2rem'
};
const subCardStyle = {
  background: 'var(--grey-50)', border: '1px solid var(--grey-200)',
  borderLeft: '3px solid var(--blue-france)', borderRadius: 4,
  padding: '1rem', marginBottom: '0.75rem'
};

// ── PageBlock sorti du composant principal ─────────────────────────
function PageBlock({
  menu, editingPage, editPageForm, setEditPageForm,
  setEditingPage, showAddPage, setShowAddPage,
  newPage, setNewPage, onAddPage, onSavePage, onDeletePage
}) {
  if (editingPage === menu.page?.id) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--grey-200)', borderRadius: 4, padding: '1rem' }}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor={`edit-title-${menu.page.id}`} style={labelStyle}>Titre</label>
          <input
            id={`edit-title-${menu.page.id}`}
            value={editPageForm.title}
            onChange={e => setEditPageForm(f => ({ ...f, title: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor={`edit-content-${menu.page.id}`} style={labelStyle}>Contenu (HTML accepté)</label>
          <textarea
            id={`edit-content-${menu.page.id}`}
            rows={6}
            value={editPageForm.content}
            onChange={e => setEditPageForm(f => ({ ...f, content: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onSavePage(menu.page.id)} style={btnPrimary}>Enregistrer</button>
          <button onClick={() => setEditingPage(null)} style={btnSecondary}>Annuler</button>
        </div>
      </div>
    );
  }

  if (menu.page) {
    return (
      <div style={{
        background: 'white', border: '1px solid var(--grey-200)',
        borderRadius: 4, padding: '0.75rem 1rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 12, flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, margin: '0 0 2px', fontSize: 14 }}>{menu.page.title}</p>
          <p style={{ fontSize: 12, color: 'var(--grey-600)', margin: 0 }}>
            {menu.page.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <Link to={`/pages/${menu.slug}`} target="_blank"
            style={{ ...btnSecondary, fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}>
            Voir
          </Link>
          <button
            onClick={() => {
              setEditingPage(menu.page.id);
              setEditPageForm({ title: menu.page.title, content: menu.page.content });
            }}
            style={{ ...btnSecondary, fontSize: 12, padding: '4px 10px' }}>
            Modifier
          </button>
          <button
            onClick={() => onDeletePage(menu.page.id)}
            style={{ ...btnDanger, fontSize: 12, padding: '4px 10px' }}>
            Supprimer
          </button>
        </div>
      </div>
    );
  }

  if (showAddPage === menu.id) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--grey-200)', borderRadius: 4, padding: '1rem' }}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor={`new-title-${menu.id}`} style={labelStyle}>Titre de la page</label>
          <input
            id={`new-title-${menu.id}`}
            placeholder="Ex : La prévention en santé mentale"
            value={newPage.title}
            onChange={e => setNewPage(p => ({ ...p, title: e.target.value }))}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor={`new-content-${menu.id}`} style={labelStyle}>Contenu (HTML accepté)</label>
          <textarea
            id={`new-content-${menu.id}`}
            rows={5}
            placeholder="<p>Contenu de la page...</p>"
            value={newPage.content}
            onChange={e => setNewPage(p => ({ ...p, content: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAddPage(menu.id)} style={btnPrimary}>Créer</button>
          <button onClick={() => setShowAddPage(null)} style={btnSecondary}>Annuler</button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setShowAddPage(menu.id); setNewPage({ title: '', content: '' }); }}
      style={{ ...btnSecondary, fontSize: 12, padding: '5px 12px' }}>
      + Créer une page
    </button>
  );
}

// ── Composant principal ────────────────────────────────────────────
const emptyMenu = { label: '', slug: '', position: '' };

export default function AdminPages() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newMenu, setNewMenu] = useState(emptyMenu);

  const [editingMenu, setEditingMenu] = useState(null);
  const [editMenuForm, setEditMenuForm] = useState(emptyMenu);

  const [showAddSubMenu, setShowAddSubMenu] = useState(null);
  const [newSubMenu, setNewSubMenu] = useState(emptyMenu);

  const [showAddPage, setShowAddPage] = useState(null);
  const [newPage, setNewPage] = useState({ title: '', content: '' });

  const [editingPage, setEditingPage] = useState(null);
  const [editPageForm, setEditPageForm] = useState({ title: '', content: '' });

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = () => {
    api.get('/menus/admin/all')
      .then(res => setMenus(res.data))
      .finally(() => setLoading(false));
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg); setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };
  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const addMenu = async () => {
    if (!newMenu.label || !newMenu.slug || !newMenu.position) return;
    try {
      await api.post('/menus/admin/menus', {
        label: newMenu.label,
        slug: newMenu.slug.toLowerCase().replace(/\s+/g, '-'),
        position: parseInt(newMenu.position)
      });
      fetchMenus();
      setNewMenu(emptyMenu);
      setShowAddMenu(false);
      showSuccess('Menu ajouté avec succès.');
    } catch (e) {
      showError(e.response?.data?.error || 'Erreur lors de l\'ajout du menu.');
    }
  };

  const addSubMenu = async (parentId) => {
    if (!newSubMenu.label || !newSubMenu.slug || !newSubMenu.position) return;
    try {
      await api.post('/menus/admin/menus', {
        label: newSubMenu.label,
        slug: newSubMenu.slug.toLowerCase().replace(/\s+/g, '-'),
        position: parseInt(newSubMenu.position),
        parentId
      });
      fetchMenus();
      setNewSubMenu(emptyMenu);
      setShowAddSubMenu(null);
      showSuccess('Sous-page ajoutée avec succès.');
    } catch (e) {
      showError(e.response?.data?.error || 'Slug déjà utilisé ou erreur serveur.');
    }
  };

  const saveMenu = async (id) => {
    try {
      await api.put(`/menus/admin/menus/${id}`, {
        label: editMenuForm.label,
        position: parseInt(editMenuForm.position),
        isVisible: true
      });
      fetchMenus();
      setEditingMenu(null);
      showSuccess('Menu modifié avec succès.');
    } catch (e) {
      showError('Erreur lors de la modification du menu.');
    }
  };

  const deleteMenu = async (id) => {
    if (!confirm('Supprimer ce menu ? Les pages associées seront également supprimées.')) return;
    try {
      await api.delete(`/menus/admin/menus/${id}`);
      fetchMenus();
      showSuccess('Menu supprimé.');
    } catch (e) {
      showError('Erreur lors de la suppression.');
    }
  };

  const toggleVisibility = async (menu) => {
    await api.put(`/menus/admin/menus/${menu.id}`, {
      label: menu.label, position: menu.position, isVisible: !menu.isVisible
    });
    fetchMenus();
    showSuccess(`Menu ${menu.isVisible ? 'masqué' : 'affiché'}.`);
  };

  const addPage = async (menuId) => {
    if (!newPage.title || !newPage.content) return;
    try {
      await api.post('/pages/admin/pages', {
        title: newPage.title, content: newPage.content, menuItemId: menuId
      });
      fetchMenus();
      setShowAddPage(null);
      setNewPage({ title: '', content: '' });
      showSuccess('Page créée avec succès.');
    } catch (e) {
      showError(e.response?.data?.error || 'Erreur lors de la création de la page.');
    }
  };

  const savePage = async (pageId) => {
    try {
      await api.put(`/pages/admin/pages/${pageId}`, {
        title: editPageForm.title, content: editPageForm.content
      });
      fetchMenus();
      setEditingPage(null);
      showSuccess('Page modifiée avec succès.');
    } catch (e) {
      showError('Erreur lors de la modification de la page.');
    }
  };

  const deletePage = async (pageId) => {
    if (!confirm('Supprimer cette page ?')) return;
    try {
      await api.delete(`/pages/admin/pages/${pageId}`);
      fetchMenus();
      showSuccess('Page supprimée.');
    } catch (e) {
      showError('Erreur lors de la suppression de la page.');
    }
  };

  const pageBlockProps = {
    editingPage, editPageForm, setEditPageForm,
    setEditingPage, showAddPage, setShowAddPage,
    newPage, setNewPage,
    onAddPage: addPage, onSavePage: savePage, onDeletePage: deletePage
  };

  return (
    <main id="main-content" role="main">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>

        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--grey-600)' }}>
            <li><Link to="/" style={{ color: 'var(--blue-france)' }}>Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Gestion des contenus</li>
          </ol>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ color: 'var(--blue-france)' }}>Gestion des contenus</h1>
          <button onClick={() => setShowAddMenu(!showAddMenu)} style={btnPrimary}>
            {showAddMenu ? 'Annuler' : '+ Ajouter un menu'}
          </button>
        </div>

        {successMsg && (
          <div role="status" aria-live="polite" style={{ background: '#e3f5e1', border: '1px solid #1a6e1a', borderLeft: '4px solid #1a6e1a', borderRadius: 4, padding: '12px 16px', marginBottom: '1.5rem', fontSize: 14, color: '#1a6e1a' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div role="alert" style={{ background: '#fef1f2', border: '1px solid var(--red-marianne)', borderLeft: '4px solid var(--red-marianne)', borderRadius: 4, padding: '12px 16px', marginBottom: '1.5rem', fontSize: 14, color: '#6e0008' }}>
            {errorMsg}
          </div>
        )}

        {showAddMenu && (
          <div style={{ ...cardStyle, borderTop: '4px solid #1a6e1a' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nouveau menu</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div>
                <label htmlFor="menu-label" style={labelStyle}>Libellé</label>
                <input id="menu-label" placeholder="Ex : Prévention"
                  value={newMenu.label}
                  onChange={e => setNewMenu(m => ({ ...m, label: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div>
                <label htmlFor="menu-slug" style={labelStyle}>Slug (URL)</label>
                <input id="menu-slug" placeholder="Ex : prevention"
                  value={newMenu.slug}
                  onChange={e => setNewMenu(m => ({ ...m, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  style={inputStyle} />
              </div>
              <div>
                <label htmlFor="menu-position" style={labelStyle}>Position</label>
                <input id="menu-position" type="number" min="1"
                  value={newMenu.position}
                  onChange={e => setNewMenu(m => ({ ...m, position: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addMenu} style={btnPrimary}>Créer le menu</button>
              <button onClick={() => { setShowAddMenu(false); setNewMenu(emptyMenu); }} style={btnSecondary}>Annuler</button>
            </div>
          </div>
        )}

        {loading && <p style={{ color: 'var(--grey-600)' }}>Chargement...</p>}

        {!loading && menus.map(menu => (
          <section key={menu.id} aria-labelledby={`menu-${menu.id}`} style={cardStyle}>

            {editingMenu === menu.id ? (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label htmlFor={`edit-menu-${menu.id}`} style={labelStyle}>Libellé</label>
                    <input id={`edit-menu-${menu.id}`}
                      value={editMenuForm.label}
                      onChange={e => setEditMenuForm(f => ({ ...f, label: e.target.value }))}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label htmlFor={`edit-pos-${menu.id}`} style={labelStyle}>Position</label>
                    <input id={`edit-pos-${menu.id}`} type="number"
                      value={editMenuForm.position}
                      onChange={e => setEditMenuForm(f => ({ ...f, position: e.target.value }))}
                      style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => saveMenu(menu.id)} style={btnPrimary}>Enregistrer</button>
                  <button onClick={() => setEditingMenu(null)} style={btnSecondary}>Annuler</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 id={`menu-${menu.id}`} style={{ fontSize: '1.125rem', margin: 0 }}>{menu.label}</h2>
                  <span style={{ fontSize: 12, color: 'var(--grey-600)', fontFamily: 'monospace' }}>/{menu.slug}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                    background: menu.isVisible ? '#e3f5e1' : '#f5e3e3',
                    color: menu.isVisible ? '#1a6e1a' : '#6e1a1a'
                  }}>
                    {menu.isVisible ? 'Visible' : 'Masqué'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => toggleVisibility(menu)} style={btnSecondary}>
                    {menu.isVisible ? 'Masquer' : 'Afficher'}
                  </button>
                  <button onClick={() => { setEditingMenu(menu.id); setEditMenuForm({ label: menu.label, slug: menu.slug, position: menu.position }); }} style={btnSecondary}>
                    Modifier
                  </button>
                  <button onClick={() => deleteMenu(menu.id)} style={btnDanger}>Supprimer</button>
                </div>
              </div>
            )}

            {/* Page principale */}
            <div style={{ borderTop: '1px solid var(--grey-100)', paddingTop: '1rem' }}>
              <p style={{ fontSize: 12, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>
                Page principale
              </p>
              <PageBlock menu={menu} {...pageBlockProps} />
            </div>

            {/* Sous-pages */}
            <div style={{ borderTop: '1px solid var(--grey-100)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <p style={{ fontSize: 12, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, margin: 0 }}>
                  Sous-pages ({menu.children?.length || 0})
                </p>
                {showAddSubMenu !== menu.id && (
                  <button onClick={() => { setShowAddSubMenu(menu.id); setNewSubMenu(emptyMenu); }}
                    style={{ ...btnSecondary, fontSize: 12, padding: '4px 12px' }}>
                    + Ajouter une sous-page
                  </button>
                )}
              </div>

              {showAddSubMenu === menu.id && (
                <div style={{ background: 'white', border: '1px solid var(--grey-200)', borderRadius: 4, padding: '1rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--blue-france)' }}>
                    Nouvelle sous-page dans "{menu.label}"
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label htmlFor={`sub-label-${menu.id}`} style={labelStyle}>Libellé</label>
                      <input id={`sub-label-${menu.id}`} placeholder="Ex : Techniques de relaxation"
                        value={newSubMenu.label}
                        onChange={e => setNewSubMenu(s => ({ ...s, label: e.target.value }))}
                        style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor={`sub-slug-${menu.id}`} style={labelStyle}>Slug (URL)</label>
                      <input id={`sub-slug-${menu.id}`} placeholder="Ex : techniques-relaxation"
                        value={newSubMenu.slug}
                        onChange={e => setNewSubMenu(s => ({ ...s, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                        style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor={`sub-pos-${menu.id}`} style={labelStyle}>Position</label>
                      <input id={`sub-pos-${menu.id}`} type="number" min="1" placeholder="1"
                        value={newSubMenu.position}
                        onChange={e => setNewSubMenu(s => ({ ...s, position: e.target.value }))}
                        style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => addSubMenu(menu.id)} style={btnPrimary}>Créer la sous-page</button>
                    <button onClick={() => setShowAddSubMenu(null)} style={btnSecondary}>Annuler</button>
                  </div>
                </div>
              )}

              {menu.children?.map(child => (
                <div key={child.id} style={subCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{child.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--grey-600)', fontFamily: 'monospace' }}>/{child.slug}</span>
                    </div>
                    <button onClick={() => deleteMenu(child.id)}
                      style={{ ...btnDanger, fontSize: 12, padding: '3px 10px' }}>
                      Supprimer
                    </button>
                  </div>
                  <PageBlock menu={child} {...pageBlockProps} />
                </div>
              ))}

              {(!menu.children || menu.children.length === 0) && showAddSubMenu !== menu.id && (
                <p style={{ fontSize: 13, color: 'var(--grey-400)', fontStyle: 'italic' }}>
                  Aucune sous-page — cliquez sur "+ Ajouter une sous-page" pour en créer.
                </p>
              )}
            </div>

          </section>
        ))}

        {!loading && menus.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--grey-600)', marginBottom: '1rem' }}>Aucun menu créé pour l'instant.</p>
            <button onClick={() => setShowAddMenu(true)} style={btnPrimary}>Créer le premier menu</button>
          </div>
        )}

      </div>
    </main>
  );
}