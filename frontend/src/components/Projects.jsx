import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const HIGHLIGHT_COLORS = {
  'Featured': { bg: 'rgba(0,212,170,0.12)', color: 'var(--teal)', border: 'rgba(0,212,170,0.25)' },
  'AI/ML':    { bg: 'rgba(168,85,247,0.12)', color: 'var(--violet)', border: 'rgba(168,85,247,0.25)' },
  'Web':      { bg: 'rgba(244,114,182,0.12)', color: 'var(--pink)', border: 'rgba(244,114,182,0.25)' },
};

const emptyProject = { title: '', description: '', tech: '', github: '', live: '', highlight: '' };

export default function Projects({ data, onUpdate }) {
  const { isAdmin, authAxios } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState(emptyProject);

  const projects = data?.projects || [];

  const saveNew = async () => {
    const payload = { ...form, tech: form.tech.split(',').map(s => s.trim()).filter(Boolean) };
    const res = await authAxios.post('/api/portfolio/projects', payload);
    onUpdate({ ...data, projects: [...projects, res.data.data] });
    setAddingNew(false);
    setForm(emptyProject);
  };

  const saveEdit = async (id) => {
    const payload = { ...form, tech: typeof form.tech === 'string' ? form.tech.split(',').map(s => s.trim()).filter(Boolean) : form.tech };
    const res = await authAxios.put(`/api/portfolio/projects/${id}`, payload);
    onUpdate({ ...data, projects: projects.map(p => p.id === id ? res.data.data : p) });
    setEditingId(null);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await authAxios.delete(`/api/portfolio/projects/${id}`);
    onUpdate({ ...data, projects: projects.filter(p => p.id !== id) });
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p, tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech });
  };

  const ProjectForm = ({ onSave, onCancel, btnLabel }) => (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--teal)' }}>
        {btnLabel === 'Add' ? 'New Project' : 'Edit Project'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        {[
          ['title', 'Project Title'],
          ['highlight', 'Badge (Featured / AI/ML / Web)'],
          ['github', 'GitHub URL'],
          ['live', 'Live URL (optional)'],
        ].map(([key, label]) => (
          <div key={key}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>{label}</label>
            <input className="admin-input" value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>Tech Stack (comma-separated)</label>
      <input className="admin-input" value={form.tech || ''} onChange={e => setForm({ ...form, tech: e.target.value })} />
      <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>Description</label>
      <textarea className="admin-input" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-primary" onClick={onSave} style={{ fontSize: '13px', padding: '8px 20px' }}>{btnLabel}</button>
        <button className="btn btn-outline" onClick={onCancel} style={{ fontSize: '13px', padding: '8px 20px' }}>Cancel</button>
      </div>
    </div>
  );

  return (
    <section id="projects">
      <div className="container">
        <div className="section-label">My Work</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Projects</h2>
          {isAdmin && (
            <button className="btn btn-outline" onClick={() => { setAddingNew(true); setForm(emptyProject); }}
              style={{ fontSize: '13px', padding: '8px 20px' }}>
              + Add Project
            </button>
          )}
        </div>

        <div className="grid-2">
          {addingNew && (
            <ProjectForm onSave={saveNew} onCancel={() => setAddingNew(false)} btnLabel="Add" />
          )}

          {projects.map(p => {
            const hl = HIGHLIGHT_COLORS[p.highlight] || {};
            if (editingId === p.id) {
              return (
                <ProjectForm key={p.id}
                  onSave={() => saveEdit(p.id)}
                  onCancel={() => setEditingId(null)}
                  btnLabel="Save" />
              );
            }
            return (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Admin controls */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginBottom: '12px' }}>
                    <button className="edit-btn" style={{ position: 'static' }} onClick={() => startEdit(p)}>✎</button>
                    <button className="edit-btn" style={{ position: 'static', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)' }}
                      onClick={() => deleteProject(p.id)}>✕</button>
                  </div>
                )}

                {/* Badge */}
                {p.highlight && (
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: '100px',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
                    background: hl.bg, color: hl.color, border: `1px solid ${hl.border}`,
                    marginBottom: '16px', alignSelf: 'flex-start',
                  }}>
                    {p.highlight}
                  </span>
                )}

                <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', marginBottom: '12px', color: 'var(--text-primary)' }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1, marginBottom: '20px' }}>
                  {p.description}
                </p>

                {/* Tech chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {(p.tech || []).map(t => (
                    <span key={t} className="chip chip-violet" style={{ fontSize: '11px' }}>{t}</span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-outline"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '10px 16px' }}>
                      GitHub →
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '10px 16px' }}>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
