const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stack: [{ type: String, required: true }],
    highlights: [{ type: String, required: true }],
    status: { type: String, default: 'completed' },
    image: { type: String, default: '' },
    github: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
