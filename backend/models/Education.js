const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    score: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
