import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';

const ROLES = [
  'Software Engineer',
  'AI/ML Developer',
  'Web Developer',
  'Problem Solver',
];

export default function Hero({ data }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    const role = ROLES[roleIdx];
    let timeout;

    if (typing) {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setRoleIdx((roleIdx + 1) % ROLES.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  const hero = data?.hero || {};

  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <ParticleBackground />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '700px', animation: 'fadeUp 0.8s ease both' }}>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)',
            fontSize: '13px', color: 'var(--teal)',
            marginBottom: '32px',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
            {hero.status || 'Open to Opportunities'}
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 76px)',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            Hi, I'm{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--teal) 0%, var(--violet) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {hero.name || 'Simran Arya'}
            </span>
          </h1>

          {/* Typewriter role */}
          <div style={{
            fontSize: 'clamp(20px, 4vw, 32px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            minHeight: '48px',
          }}>
            {displayed}
            <span style={{
              display: 'inline-block', width: '2px', height: '1em',
              background: 'var(--teal)', marginLeft: '4px', verticalAlign: 'text-bottom',
              animation: 'blink 1s step-end infinite',
            }} />
          </div>

          <p style={{
            fontSize: '17px', color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px',
          }}>
            {hero.subtitle || 'Building AI-powered solutions & scalable web applications'}
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
            <a href="#projects" className="btn btn-primary">
              View Projects
              <span>→</span>
            </a>
            <a href="#contact" className="btn btn-outline">
              Get In Touch
            </a>
          </div>

          {/* Coding profiles */}
          {hero.codingProfiles && hero.codingProfiles.length > 0 && (
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Coding Profiles
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {hero.codingProfiles.map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '13px',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.color = 'var(--teal)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {p.platform}
                    {p.username !== 'your_username' && <span style={{ opacity: 0.5 }}>· {p.username}</span>}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, var(--teal), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
