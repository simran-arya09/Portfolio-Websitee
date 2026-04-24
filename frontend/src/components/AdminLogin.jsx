import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAdmin, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(password);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="admin" style={{ paddingTop: '80px', paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card glow-teal">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'var(--violet-dim)', border: '1px solid rgba(168,85,247,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', margin: '0 auto 16px',
              }}>
                🔒
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '6px' }}>
                Admin Access
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Only Simran can edit this portfolio.
              </p>
            </div>

            {isAdmin ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--teal)', marginBottom: '20px', fontSize: '15px' }}>
                  ✦ You're logged in as admin
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                  Edit buttons are now visible throughout the site.
                </p>
                <button className="btn btn-outline" onClick={logout} style={{ width: '100%', justifyContent: 'center' }}>
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <label style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  display: 'block', marginBottom: '8px',
                }}>
                  Password
                </label>
                <input
                  className="admin-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />

                {error && (
                  <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Logging in…' : 'Login as Admin'}
                </button>
              </form>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
            This section is hidden from public view in production.
          </p>
        </div>
      </div>
    </section>
  );
}
