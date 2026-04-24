import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function About({ data, onUpdate }) {
  const { isAdmin, authAxios } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const about = data?.about || {};

  const startEdit = () => {
    setForm({
      summary: about.summary || '',
      areasOfInterest: (about.areasOfInterest || []).join(', '),
      coursework: (about.coursework || []).join(', '),
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    const payload = {
      summary: form.summary,
      areasOfInterest: form.areasOfInterest.split(',').map(s => s.trim()).filter(Boolean),
      coursework: form.coursework.split(',').map(s => s.trim()).filter(Boolean),
    };
    const res = await authAxios.put('/api/portfolio/about', payload);
    onUpdate({ ...data, about: res.data.data });
    setEditing(false);
  };

  const eduIcons = ['🎓', '📚', '🏫'];

  return (
    <section id="about">
      <div className="container">
        <div className="section-label">About Me</div>
        <h2 className="section-title">Who I Am</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}
          className="about-grid">

          {/* Left — summary */}
          <div style={{ position: 'relative' }}>
            {isAdmin && !editing && (
              <button className="edit-btn" onClick={startEdit}>✎ Edit</button>
            )}

            {editing ? (
              <div className="card">
                <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--teal)' }}>Edit About</h3>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Summary</label>
                <textarea className="admin-input" value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })} />
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Areas of Interest (comma-separated)</label>
                <input className="admin-input" value={form.areasOfInterest}
                  onChange={e => setForm({ ...form, areasOfInterest: e.target.value })} />
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Coursework (comma-separated)</label>
                <input className="admin-input" value={form.coursework}
                  onChange={e => setForm({ ...form, coursework: e.target.value })} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary" onClick={saveEdit} style={{ fontSize: '13px', padding: '8px 20px' }}>Save</button>
                  <button className="btn btn-outline" onClick={() => setEditing(false)} style={{ fontSize: '13px', padding: '8px 20px' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
                  {about.summary}
                </p>

                {/* Areas of interest */}
                <div style={{ marginBottom: '32px' }}>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Areas of Interest
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(about.areasOfInterest || []).map((a, i) => (
                      <span key={i} className="chip">{a}</span>
                    ))}
                  </div>
                </div>

                {/* Coursework */}
                <div>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Relevant Coursework
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(about.coursework || []).map((c, i) => (
                      <span key={i} className="chip chip-violet">{c}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right — education timeline */}
          <div>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Education
            </p>
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              {/* vertical line */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '1px', background: 'linear-gradient(to bottom, var(--teal), var(--violet), transparent)',
              }} />

              {(about.education || []).map((e, i) => (
                <div key={i} style={{ marginBottom: i < (about.education.length - 1) ? '32px' : 0, position: 'relative' }}>
                  {/* dot */}
                  <div style={{
                    position: 'absolute', left: '-30px', top: '6px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: i === 0 ? 'var(--teal)' : 'var(--bg-mid)',
                    border: '2px solid ' + (i === 0 ? 'var(--teal)' : 'var(--border)'),
                    boxShadow: i === 0 ? '0 0 12px rgba(0,212,170,0.5)' : 'none',
                  }} />

                  <div className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                        {eduIcons[i]} {e.degree}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--teal)', background: 'var(--teal-dim)', padding: '3px 10px', borderRadius: '100px' }}>
                        {e.grade}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      {e.institution}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {e.location} · {e.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
