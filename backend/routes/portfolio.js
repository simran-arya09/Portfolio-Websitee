const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const DATA_PATH = path.join(__dirname, '../data/portfolio.json');

const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
// GET /api/portfolio  — full portfolio data
router.get('/', (req, res) => {
  try {
    res.json(readData());
  } catch {
    res.status(500).json({ error: 'Could not read data.' });
  }
});

// ─── PROTECTED ROUTES (Admin Only) ──────────────────────────────
// PUT /api/portfolio/hero
router.put('/hero', authMiddleware, (req, res) => {
  const data = readData();
  data.hero = { ...data.hero, ...req.body };
  writeData(data);
  res.json({ message: 'Hero updated', data: data.hero });
});

// PUT /api/portfolio/about
router.put('/about', authMiddleware, (req, res) => {
  const data = readData();
  data.about = { ...data.about, ...req.body };
  writeData(data);
  res.json({ message: 'About updated', data: data.about });
});

// PUT /api/portfolio/skills
router.put('/skills', authMiddleware, (req, res) => {
  const data = readData();
  data.skills = { ...data.skills, ...req.body };
  writeData(data);
  res.json({ message: 'Skills updated', data: data.skills });
});

// GET /api/portfolio/projects
router.get('/projects', (req, res) => {
  res.json(readData().projects);
});

// POST /api/portfolio/projects  — add a project
router.post('/projects', authMiddleware, (req, res) => {
  const data = readData();
  const newProject = {
    id: Date.now(),
    title: req.body.title || 'New Project',
    description: req.body.description || '',
    tech: req.body.tech || [],
    github: req.body.github || '',
    live: req.body.live || '',
    highlight: req.body.highlight || ''
  };
  data.projects.push(newProject);
  writeData(data);
  res.status(201).json({ message: 'Project added', data: newProject });
});

// PUT /api/portfolio/projects/:id  — update a project
router.put('/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  data.projects[idx] = { ...data.projects[idx], ...req.body };
  writeData(data);
  res.json({ message: 'Project updated', data: data.projects[idx] });
});

// DELETE /api/portfolio/projects/:id
router.delete('/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  data.projects.splice(idx, 1);
  writeData(data);
  res.json({ message: 'Project deleted' });
});

// POST /api/portfolio/activities  — add an activity
router.post('/activities', authMiddleware, (req, res) => {
  const data = readData();
  data.activities.push(req.body);
  writeData(data);
  res.status(201).json({ message: 'Activity added' });
});

// DELETE /api/portfolio/activities/:index
router.delete('/activities/:index', authMiddleware, (req, res) => {
  const data = readData();
  data.activities.splice(parseInt(req.params.index), 1);
  writeData(data);
  res.json({ message: 'Activity deleted' });
});

// PUT /api/portfolio/contact
router.put('/contact', authMiddleware, (req, res) => {
  const data = readData();
  data.contact = { ...data.contact, ...req.body };
  writeData(data);
  res.json({ message: 'Contact updated', data: data.contact });
});

module.exports = router;
