import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const links = ['About', 'Skills', 'Projects', 'Activities', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 24px',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.3s',
      background: scrolled ? 'rgba(5,5,15,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      {/* Logo */}
      <a href="#home" style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '20px',
        background: 'linear-gradient(135deg, var(--teal), var(--violet))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        SA
      </a>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`}
            style={{
              fontSize: '14px', color: 'var(--text-secondary)',
              transition: 'color 0.2s', fontWeight: 400,
            }}
            onMouseEnter={e => e.target.style.color = 'var(--teal)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >
            {l}
          </a>
        ))}

        {isAdmin ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--teal)', background: 'var(--teal-dim)', padding: '4px 10px', borderRadius: '100px' }}>
              ✦ Admin Mode
            </span>
            <button onClick={logout} style={{
              background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
              color: 'var(--violet)', borderRadius: '6px', padding: '6px 14px',
              fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              Logout
            </button>
          </div>
        ) : (
          <a href="#admin" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Admin
          </a>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-primary)', fontSize: '20px',
        }}
        className="hamburger"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: '64px',
          background: 'rgba(5,5,15,0.97)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '40px',
          zIndex: 999,
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
