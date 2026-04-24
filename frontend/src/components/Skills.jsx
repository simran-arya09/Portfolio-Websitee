import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Tech icons as colored SVG/emoji combos with 3D card style
const TECH_COLORS = {
  'C++':        { bg: '#00599C', text: '#fff', symbol: 'C++' },
  'Python':     { bg: '#3776AB', text: '#FFD343', symbol: 'Py' },
  'JavaScript': { bg: '#F7DF1E', text: '#000', symbol: 'JS' },
  'Java':       { bg: '#ED8B00', text: '#fff', symbol: 'Jv' },
  'React.js':   { bg: '#20232A', text: '#61DAFB', symbol: '⚛' },
  'OpenCV':     { bg: '#5C3EE8', text: '#fff', symbol: 'CV' },
  'TensorFlow': { bg: '#FF6F00', text: '#fff', symbol: 'TF' },
  'Keras':      { bg: '#D00000', text: '#fff', symbol: 'Ks' },
  'Git':        { bg: '#F05032', text: '#fff', symbol: 'Git' },
  'GitHub':     { bg: '#24292E', text: '#fff', symbol: 'GH' },
  'Streamlit':  { bg: '#FF4B4B', text: '#fff', symbol: 'St' },
  'Jupyter Notebook': { bg: '#F37626', text: '#fff', symbol: 'Jp' },
  'Linux':      { bg: '#FCC624', text: '#000', symbol: '🐧' },
  'Docker':     { bg: '#2496ED', text: '#fff', symbol: '🐳' },
};

function TechCard({ name }) {
  const { bg, text, symbol } = TECH_COLORS[name] || { bg: '#334155', text: '#fff', symbol: name.slice(0,2) };
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        cursor: 'default',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-8px) scale(1.06)' : 'none',
      }}
    >
      {/* 3D icon face */}
      <div style={{
        width: '56px', height: '56px',
        background: bg,
        borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: symbol.length > 2 ? '14px' : '18px',
        fontWeight: 800,
        color: text,
        fontFamily: 'var(--font-display)',
        boxShadow: hovered
          ? `0 12px 28px ${bg}55, 4px 4px 0 ${bg}88`
          : `4px 4px 0 ${bg}44, 0 4px 12px ${bg}33`,
        transform: hovered
          ? 'perspective(300px) rotateX(-8deg) rotateY(4deg)'
          : 'perspective(300px) rotateX(-5deg) rotateY(2deg)',
        transition: 'all 0.3s ease',
        border: `1px solid ${bg}88`,
        letterSpacing: symbol.length > 2 ? '-0.04em' : '0',
      }}>
        {symbol}
      </div>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '68px', lineHeight: 1.3 }}>
        {name}
      </span>
    </div>
  );
}

export default function Skills({ data, onUpdate }) {
  const { isAdmin, authAxios } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const skills = data?.skills || {};

  const startEdit = () => {
    setForm({
      languages: (skills.languages || []).join(', '),
      frameworks: (skills.frameworks || []).join(', '),
      tools: (skills.tools || []).join(', '),
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    const payload = {
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      frameworks: form.frameworks.split(',').map(s => s.trim()).filter(Boolean),
      tools: form.tools.split(',').map(s => s.trim()).filter(Boolean),
    };
    const res = await authAxios.put('/api/portfolio/skills', payload);
    onUpdate({ ...data, skills: res.data.data });
    setEditing(false);
  };

  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.tools || []),
  ];

  return (
    <section id="skills" style={{
      background: 'linear-gradient(180deg, transparent, rgba(0,212,170,0.02), transparent)',
    }}>
      <div className="container">
        <div className="section-label">Technical Skills</div>
        <h2 className="section-title">My Tech Stack</h2>

        {isAdmin && !editing && (
          <button className="edit-btn" style={{ position: 'relative', marginBottom: '24px' }} onClick={startEdit}>
            ✎ Edit Skills
          </button>
        )}

        {editing ? (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--teal)' }}>Edit Skills</h3>
            {['languages', 'frameworks', 'tools'].map(key => (
              <div key={key}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                  {key} (comma-separated)
                </label>
                <input className="admin-input" value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={saveEdit} style={{ fontSize: '13px', padding: '8px 20px' }}>Save</button>
              <button className="btn btn-outline" onClick={() => setEditing(false)} style={{ fontSize: '13px', padding: '8px 20px' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* Category labels */}
            {[
              { label: 'Languages', items: skills.languages },
              { label: 'Frameworks & Libraries', items: skills.frameworks },
              { label: 'Tools & Platforms', items: skills.tools },
            ].map(({ label, items }) => (
              <div key={label} style={{ marginBottom: '48px' }}>
                <p style={{
                  fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--text-muted)', marginBottom: '24px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  {label}
                  <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </p>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '24px 32px',
                  justifyContent: 'center',
                }}>
                  {(items || []).map(name => (
                    <TechCard key={name} name={name} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
