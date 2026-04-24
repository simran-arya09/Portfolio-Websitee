import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ORG_COLORS = [
  { bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.2)', dot: 'var(--teal)' },
  { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', dot: 'var(--violet)' },
  { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', dot: 'var(--pink)' },
  { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', dot: '#fbbf24' },
];

const emptyActivity = { org: '', role: '', description: '' };

export default function Activities({ data, onUpdate }) {
  const { isAdmin, authAxios } = useAuth();
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState(emptyActivity);

  const activities = data?.activities || [];

  const saveNew = async () => {
    const res = await authAxios.post('/api/portfolio/activities', form);
    onUpdate({ ...data, activities: [...activities, form] });
    setAddingNew(false);
    setForm(emptyActivity);
  };

  const deleteActivity = async (idx) => {
    if (!window.confirm('Remove this activity?')) return;
    await authAxios.delete(`/api/portfolio/activities/${idx}`);
    onUpdate({ ...data, activities: activities.filter((_, i) => i !== idx) });
  };

  return (
    <section id="activities" style={{
      background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.02), transparent)',
    }}>
      <div className="container">
        <div className="section-label">Beyond Coding</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Co-Curricular Activities</h2>
          {isAdmin && (
            <button className="btn btn-outline" onClick={() => { setAddingNew(true); setForm(emptyActivity); }}
              style={{ fontSize: '13px', padding: '8px 20px' }}>
              + Add Activity
            </button>
          )}
        </div>

        {addingNew && (
          <div className="card" style={{ maxWidth: '600px', marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--teal)' }}>New Activity</h3>
            {[['org', 'Organization'], ['role', 'Role/Title'], ['description', 'Description']].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>{label}</label>
                {key === 'description'
                  ? <textarea className="admin-input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  : <input className="admin-input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                }
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={saveNew} style={{ fontSize: '13px', padding: '8px 20px' }}>Add</button>
              <button className="btn btn-outline" onClick={() => setAddingNew(false)} style={{ fontSize: '13px', padding: '8px 20px' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="grid-2">
          {activities.map((a, i) => {
            const c = ORG_COLORS[i % ORG_COLORS.length];
            return (
              <div key={i} className="card" style={{ position: 'relative' }}>
                {isAdmin && (
                  <button className="edit-btn" style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)' }}
                    onClick={() => deleteActivity(i)}>✕ Remove</button>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: c.bg, border: `1px solid ${c.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>
                    {i === 0 ? '💻' : i === 1 ? '🛡️' : i === 2 ? '🎤' : '📣'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                      {a.org}
                    </h3>
                    <p style={{
                      fontSize: '12px', fontWeight: 500, marginBottom: '8px',
                      color: c.dot, background: c.bg, display: 'inline-block',
                      padding: '3px 10px', borderRadius: '100px', border: `1px solid ${c.border}`,
                    }}>
                      {a.role}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {a.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
