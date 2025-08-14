// backend/routes/user.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('notesUploaded', 'title')
      .populate('notesPurchased.note', 'title price');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get purchase history
router.get('/purchases', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('notesPurchased')
      .populate('notesPurchased.note', 'title price');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ purchases: user.notesPurchased });
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update profile (name, university info)
 */
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.university) updates.university = req.body.university;
    if (req.body.universityId) updates.universityId = req.body.universityId;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    return res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
