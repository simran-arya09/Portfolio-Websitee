const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  try {
    // Compare with hashed password stored in env
    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/verify  — quick token validity check
router.post('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ valid: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.json({ valid: false });
  }
});

module.exports = router;
