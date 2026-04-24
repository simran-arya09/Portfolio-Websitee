require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Serve Frontend in Production ───────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Data file: ./data/portfolio.json`);
  console.log(`🔒 Admin login: POST /api/auth/login\n`);
});
