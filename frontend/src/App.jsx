import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Activities from './components/Activities';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import './index.css';

function Portfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/portfolio')
      .then(res => setData(res.data))
      .catch(() => setError('Could not load portfolio data. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '20px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '2px solid var(--teal-dim)',
        borderTopColor: 'var(--teal)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading portfolio…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center',
    }}>
      <div>
        <p style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{error}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Run <code style={{ background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px' }}>npm run dev</code> in the backend folder.</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main>
        <Hero data={data} />
        <About data={data} onUpdate={setData} />
        <Skills data={data} onUpdate={setData} />
        <Projects data={data} onUpdate={setData} />
        <Activities data={data} onUpdate={setData} />
        <Contact data={data} onUpdate={setData} />
        <AdminLogin />
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Portfolio />
    </AuthProvider>
  );
}
