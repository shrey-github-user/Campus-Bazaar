// backend/models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  category: {
    type: String,
    enum: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Arts', 'Other'],
    default: 'Other'
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  semester: {
    type: String,
    trim: true
  },
  isForSale: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    max: [10000, 'Price cannot exceed ₹10,000']
  },
  downloads: {
    type: Number,
    default: 0
  },
  purchasedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    price: {
      type: Number
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  university: {
    type: String,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for now, can be changed for moderation
  },
  reportCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
noteSchema.index({ title: 'text', description: 'text', subject: 'text' });
noteSchema.index({ uploader: 1 });
noteSchema.index({ category: 1 });
noteSchema.index({ isForSale: 1 });
noteSchema.index({ university: 1 });
noteSchema.index({ createdAt: -1 });

// Validate price for selling notes
noteSchema.pre('save', function(next) {
  if (this.isForSale && (!this.price || this.price <= 0)) {
    return next(new Error('Price is required for notes being sold'));
  }
  if (!this.isForSale) {
    this.price = undefined;
  }
  next();
});

// Update rating when reviews change
noteSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((total / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Note', noteSchema);
