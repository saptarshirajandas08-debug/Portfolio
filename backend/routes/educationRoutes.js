const express = require('express');
const router = express.Router();

const Education = require('../models/Education');
const requireAdmin = require('../middleware/auth');

// GET /api/education -> public
router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ year: -1 });
    return res.json(education);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load education', error: err.message });
  }
});

// POST /api/education -> protected
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { year, degree, institution, score } = req.body;
    if (!year || !degree || !institution || !score) {
      return res.status(400).json({ message: 'year, degree, institution, and score are required.' });
    }
    const entry = await Education.create({ year: Number(year), degree, institution, score });
    return res.status(201).json(entry);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create education entry', error: err.message });
  }
});

// PUT /api/education/:id -> protected
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { year, degree, institution, score } = req.body;
    const update = {};
    if (year !== undefined) update.year = Number(year);
    if (degree !== undefined) update.degree = degree;
    if (institution !== undefined) update.institution = institution;
    if (score !== undefined) update.score = score;

    const entry = await Education.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!entry) return res.status(404).json({ message: 'Education entry not found.' });
    return res.json(entry);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update education entry', error: err.message });
  }
});

// DELETE /api/education/:id -> protected
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const entry = await Education.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Education entry not found.' });
    return res.json({ message: 'Deleted.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete education entry', error: err.message });
  }
});

module.exports = router;
