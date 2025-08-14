// backend/routes/notes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Note = require('../models/Note');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { validateNoteUpload } = require('../middleware/validation');
const { getNotes } = require('../controllers/noteController');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'notes');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `note-${uniqueSuffix}${fileExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and text files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

router.get('/', getNotes);

// Get all sharing notes (free)
router.get('/sharing', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, university } = req.query;
    
    let query = { isForSale: false, isApproved: true };
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add university filter
    if (university && university !== 'All') {
      query.university = university;
    }

    const notes = await Note.find(query)
      .populate('uploader', 'name university')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching sharing notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Get all selling notes (paid)
router.get('/selling', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, priceRange, university } = req.query;
    
    let query = { isForSale: true, isApproved: true };
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Add price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    }
    
    // Add university filter
    if (university && university !== 'All') {
      query.university = university;
    }

    const notes = await Note.find(query)
      .populate('uploader', 'name university')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching selling notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Upload note for sharing (free)
router.post('/upload-sharing', authMiddleware, upload.single('file'), validateNoteUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, category, subject, semester, tags } = req.body;
    const user = await User.findById(req.user.userId);

    const note = new Note({
      title,
      description,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploader: req.user.userId,
      category: category || 'Other',
      subject,
      semester,
      university: user.university,
      isForSale: false,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await note.save();

    // Add note to user's uploaded notes
    user.notesUploaded.push(note._id);
    await user.save();

    await note.populate('uploader', 'name university');

    res.status(201).json({
      message: 'Note uploaded successfully!',
      note
    });

  } catch (error) {
    console.error('Error uploading sharing note:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Error uploading note' });
  }
});

// Upload note for selling (paid)
router.post('/upload-selling', authMiddleware, upload.single('file'), validateNoteUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, price, category, subject, semester, tags } = req.body;
    
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Valid price is required for selling notes' });
    }

    const user = await User.findById(req.user.userId);

    const note = new Note({
      title,
      description,
      price: parseFloat(price),
      fileUrl: `/uploads/notes/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploader: req.user.userId,
      category: category || 'Other',
      subject,
      semester,
      university: user.university,
      isForSale: true,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await note.save();

    // Add note to user's uploaded notes
    user.notesUploaded.push(note._id);
    await user.save();

    await note.populate('uploader', 'name university');

    res.status(201).json({
      message: 'Note uploaded for sale successfully!',
      note
    });

  } catch (error) {
    console.error('Error uploading selling note:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Error uploading note' });
  }
});

// Get single note details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploader', 'name university')
      .populate('reviews.user', 'name');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note });

  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// Download note
router.post('/download/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const user = await User.findById(req.user.userId);

    // Check if it's a selling note and user hasn't purchased it
    if (note.isForSale && note.uploader.toString() !== req.user.userId) {
      const hasPurchased = note.purchasedBy.some(
        purchase => purchase.user.toString() === req.user.userId
      );
      
      if (!hasPurchased) {
        return res.status(403).json({ message: 'You must purchase this note before downloading' });
      }
    }

    // Increment download count
    note.downloads += 1;
    await note.save();

    // Add to user's downloaded notes if not already present
    if (!user.notesDownloaded.includes(note._id)) {
      user.notesDownloaded.push(note._id);
      await user.save();
    }

    // Return file path for frontend to handle download
    res.json({
      message: 'Download authorized',
      fileUrl: note.fileUrl,
      fileName: note.fileName
    });

  } catch (error) {
    console.error('Error downloading note:', error);
    res.status(500).json({ message: 'Error downloading note' });
  }
});

// Purchase note
router.post('/purchase/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.isForSale) {
      return res.status(400).json({ message: 'This note is not for sale' });
    }

    if (note.uploader.toString() === req.user.userId) {
      return res.status(400).json({ message: 'You cannot purchase your own note' });
    }

    const buyer = await User.findById(req.user.userId);
    const seller = await User.findById(note.uploader);

    // Check if already purchased
    const alreadyPurchased = note.purchasedBy.some(
      purchase => purchase.user.toString() === req.user.userId
    );
    
    if (alreadyPurchased) {
      return res.status(400).json({ message: 'You have already purchased this note' });
    }

    // In a real application, you would integrate with a payment gateway here
    // For this demo, we'll simulate a successful payment
    
    // Add purchase record to note
    note.purchasedBy.push({
      user: req.user.userId,
      price: note.price
    });
    await note.save();

    // Add to buyer's purchase history
    buyer.notesPurchased.push({
      note: note._id,
      price: note.price
    });
    await buyer.save();

    // Add earnings to seller
    seller.totalEarnings += note.price;
    await seller.save();

    res.json({
      message: 'Purchase successful!',
      note: {
        id: note._id,
        title: note.title,
        price: note.price
      }
    });

  } catch (error) {
    console.error('Error purchasing note:', error);
    res.status(500).json({ message: 'Error processing purchase' });
  }
});

// Update note (only by owner)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own notes' });
    }

    const { title, description, price, category, subject, semester, tags } = req.body;

    // Update allowed fields
    if (title) note.title = title;
    if (description) note.description = description;
    if (category) note.category = category;
    if (subject) note.subject = subject;
    if (semester) note.semester = semester;
    if (tags) note.tags = tags.split(',').map(tag => tag.trim());
    
    // Only allow price update for selling notes
    if (note.isForSale && price && !isNaN(price) && parseFloat(price) > 0) {
      note.price = parseFloat(price);
    }

    await note.save();
    await note.populate('uploader', 'name university');

    res.json({
      message: 'Note updated successfully!',
      note
    });

  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete note (only by owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own notes' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', note.fileUrl);
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Remove note from database
    await Note.findByIdAndDelete(req.params.id);

    // Remove from user's uploaded notes
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { notesUploaded: req.params.id }
    });

    res.json({ message: 'Note deleted successfully!' });

  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

// Add review to note
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user has purchased the note (for selling notes)
    if (note.isForSale && note.uploader.toString() !== req.user.userId) {
      const hasPurchased = note.purchasedBy.some(
        purchase => purchase.user.toString() === req.user.userId
      );
      
      if (!hasPurchased) {
        return res.status(403).json({ message: 'You must purchase this note to review it' });
      }
    }

    // Check if user has already reviewed
    const existingReview = note.reviews.find(
      review => review.user.toString() === req.user.userId
    );
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      // Add new review
      note.reviews.push({
        user: req.user.userId,
        rating,
        comment
      });
    }

    // Update rating
    note.updateRating();
    await note.save();

    await note.populate('reviews.user', 'name');

    res.json({
      message: 'Review added successfully!',
      review: note.reviews[note.reviews.length - 1]
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

// Get user's uploaded notes
router.get('/user/uploaded', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ uploader: req.user.userId })
      .populate('uploader', 'name university')
      .sort({ createdAt: -1 });

    res.json({ notes });

  } catch (error) {
    console.error('Error fetching user notes:', error);
    res.status(500).json({ message: 'Error fetching your notes' });
  }
});

// Get user's purchase history
router.get('/user/purchases', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'notesPurchased.note',
        populate: {
          path: 'uploader',
          select: 'name university'
        }
      });

    res.json({ 
      purchases: user.notesPurchased.reverse() // Most recent first
    });

  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ message: 'Error fetching purchase history' });
  }
});

module.exports = router;
