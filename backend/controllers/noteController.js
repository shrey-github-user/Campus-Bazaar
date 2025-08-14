// controllers/noteController.js
const Note = require('../models/Note'); // Adjust if model name/path differs

// GET /api/notes
const getNotes = async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      query = { title: { $regex: q, $options: 'i' } }; // case-insensitive
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching notes' });
  }
};

module.exports = { getNotes };
