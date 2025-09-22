const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'behavioral', 'dsa', 'system-design'],
    required: [true, 'Category is required']
  },
  type: {
    type: String,
    enum: ['article', 'video', 'tutorial', 'blog', 'book', 'course', 'practice'],
    required: [true, 'Resource type is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  url: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  author: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  estimatedTime: {
    type: Number, // in minutes
    default: null
  },
  questions: [{
    question: String,
    answer: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    tags: [String]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
resourceSchema.index({ title: 'text', content: 'text', tags: 'text' });
resourceSchema.index({ category: 1, type: 1 });
resourceSchema.index({ difficulty: 1 });

// Update updatedAt on save
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Increment views
resourceSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Increment likes
resourceSchema.methods.incrementLikes = async function() {
  this.likes += 1;
  await this.save();
};

module.exports = mongoose.model('Resource', resourceSchema);