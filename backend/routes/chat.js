// backend/routes/chat.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage'); // we'll make this simple model below

const router = express.Router();

/**
 * Save a new message
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const message = new ChatMessage({
      sender: req.user.userId,
      text
    });

    await message.save();
    // Populate sender info before returning
    const populatedMsg = await ChatMessage.findById(message._id).populate('sender', 'name university');
    return res.status(201).json({ message: 'Message saved', data: populatedMsg });
  } catch (err) {
    console.error('Error saving message:', err);
    return res.status(500).json({ message: 'Error saving message' });
  }
});

/**
 * Get last 50 messages
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .populate('sender', 'name university')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ messages: messages.reverse() });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
