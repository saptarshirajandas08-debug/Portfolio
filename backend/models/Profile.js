const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    tagline: { type: String, required: true },
    foundation: [{ type: String }],
    stack: [{ type: String }],
    alsoShippedIn: [{ type: String }],
    summary: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
