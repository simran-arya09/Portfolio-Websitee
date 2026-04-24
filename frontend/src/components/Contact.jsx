import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Contact({ data, onUpdate }) {
  const { isAdmin, authAxios } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const contact = data?.contact || {};

  const startEdit = () => {
    setForm({ ...contact });
    setEditing(true);
  };

  const saveEdit = async () => {
    const res = await authAxios.put('/api/portfolio/contact', form);
    onUpdate({ ...data, contact: res.data.data });
    setEditing(false);
  };

  const links = [
    { label: 'Email', icon: '✉', value: contact.email, href: `mailto:${contact.email}` },
    { label: 'LinkedIn', icon: 'in', value: 'Connect with me', href: contact.linkedin, external: true },
    { label: 'GitHub', icon: '</>', value: 'View my code', href: contact.github, external: true },
    { label: 'Phone', icon: '☎', value: contact.phone, href: `tel:${contact.phone}` },
  ];

  return (
    <section id="contact">
      <div className="container">
        <div className="section-label">Contact</div>
        <h2 className="section-title">Let's Connect</h2>

        {/* Centered layout */}
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: 1.7 }}>
            I'm always open to new opportunities, collaborations, or just a friendly chat about AI and tech.
          </p>

          {isAdmin && !editing && (
            <button className="edit-btn" style={{ position: 'relative', marginBottom: '24px' }} onClick={startEdit}>
              ✎ Edit Contact
            </button>
          )}

          {editing ? (
            <div className="card" style={{ textAlign: 'left' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--teal)' }}>Edit Contact Info</h3>
              {['email', 'phone', 'linkedin', 'github'].map(key => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                    {key}
                  </label>
                  <input className="admin-input" value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={saveEdit} style={{ fontSize: '13px', padding: '8px 20px' }}>Save</button>
                <button className="btn btn-outline" onClick={() => setEditing(false)} style={{ fontSize: '13px', padding: '8px 20px' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {links.map(({ label, icon, value, href, external }) => (
                <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
                  className="card"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    textDecoration: 'none', cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: 'var(--teal-dim)', border: '1px solid rgba(0,212,170,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', color: 'var(--teal)', fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                  }}>
                    {icon}
                  </div>
                  <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: '80px', paddingTop: '40px',
          borderTop: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Built with ❤️ by Simran Arya · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}
