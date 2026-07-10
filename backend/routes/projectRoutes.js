const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const Project = require('../models/Project');
const requireAdmin = require('../middleware/auth');
const upload = require('../utils/upload');

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    // highlights come from a textarea -> one per line; stack comes comma separated
    if (value.includes('\n')) {
      return value.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function deleteFileIfLocal(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const fullPath = path.join(__dirname, '..', imagePath);
  fs.unlink(fullPath, () => {}); // ignore errors, best-effort cleanup
}

// GET /api/projects -> public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load projects', error: err.message });
  }
});

// POST /api/projects -> protected, optional image upload
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, stack, highlights, status, github, liveUrl, order } = req.body;
    if (!name || !stack || !highlights) {
      return res.status(400).json({ message: 'name, stack, and highlights are required.' });
    }

    const project = await Project.create({
      name,
      stack: toArray(stack),
      highlights: toArray(highlights),
      status: status || 'completed',
      github: github || '',
      liveUrl: liveUrl || '',
      order: order ? Number(order) : 0,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
});

// PUT /api/projects/:id -> protected, optional image upload replaces old image
router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const { name, stack, highlights, status, github, liveUrl, order } = req.body;
    if (name !== undefined) project.name = name;
    if (stack !== undefined) project.stack = toArray(stack);
    if (highlights !== undefined) project.highlights = toArray(highlights);
    if (status !== undefined) project.status = status;
    if (github !== undefined) project.github = github;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (order !== undefined) project.order = Number(order);

    if (req.file) {
      deleteFileIfLocal(project.image);
      project.image = `/uploads/${req.file.filename}`;
    }

    await project.save();
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
});

// DELETE /api/projects/:id -> protected
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    deleteFileIfLocal(project.image);
    return res.json({ message: 'Deleted.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
});

module.exports = router;
