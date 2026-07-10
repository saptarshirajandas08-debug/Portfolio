const express = require('express');
const router = express.Router();

const Profile = require('../models/Profile');
const requireAdmin = require('../middleware/auth');
const upload = require('../utils/upload');

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// GET /api/profile -> public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Did you run npm run seed?' });
    }
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
});

// PUT /api/profile -> protected, optional avatar upload
router.put('/', requireAdmin, upload.single('avatar'), async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Did you run npm run seed?' });
    }

    const fields = [
      'name',
      'role',
      'tagline',
      'summary',
      'location',
      'email',
      'phone',
      'linkedin',
      'github'
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });

    ['foundation', 'stack', 'alsoShippedIn'].forEach((field) => {
      if (req.body[field] !== undefined) profile[field] = toArray(req.body[field]);
    });

    if (req.file) {
      profile.avatar = `/uploads/${req.file.filename}`;
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

module.exports = router;
