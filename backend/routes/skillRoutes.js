const express = require('express');
const router = express.Router();

const Skill = require('../models/Skill');
const requireAdmin = require('../middleware/auth');

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// GET /api/skills -> public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load skills', error: err.message });
  }
});

// POST /api/skills -> protected
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { category, items, order } = req.body;
    if (!category || !items) {
      return res.status(400).json({ message: 'category and items are required.' });
    }
    const skill = await Skill.create({
      category,
      items: toArray(items),
      order: order ? Number(order) : 0
    });
    return res.status(201).json(skill);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create skill category', error: err.message });
  }
});

// PUT /api/skills/:id -> protected
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { category, items, order } = req.body;
    const update = {};
    if (category !== undefined) update.category = category;
    if (items !== undefined) update.items = toArray(items);
    if (order !== undefined) update.order = Number(order);

    const skill = await Skill.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!skill) return res.status(404).json({ message: 'Skill category not found.' });
    return res.json(skill);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update skill category', error: err.message });
  }
});

// DELETE /api/skills/:id -> protected
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill category not found.' });
    return res.json({ message: 'Deleted.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete skill category', error: err.message });
  }
});

module.exports = router;
