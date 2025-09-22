const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['behavioral', 'fullstack', 'frontend', 'backend', 'dsa'],
    required: [true, 'Interview type is required']
  },
  date: {
    type: Date,
    required: [true, 'Interview date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Interview date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Interview time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  interviewer: {
    type: String,
    required: [true, 'Interviewer name is required']
  },
  interviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  feedback: {
    type: String,
    default: null
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  result: {
    type: String,
    enum: ['passed', 'failed', 'pending'],
    default: 'pending'
  },
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  meetingLink: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  questions: [{
    question: String,
    answer: String,
    rating: Number
  }],
  recordingUrl: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 60
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

// Update updatedAt on save
interviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for formatted date and time
interviewSchema.virtual('dateTime').get(function() {
  if (this.date && this.time) {
    const [hours, minutes] = this.time.split(':');
    const dateTime = new Date(this.date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return dateTime;
  }
  return null;
});

// Auto-update status based on date
interviewSchema.methods.updateStatus = function() {
  const now = new Date();
  const interviewDateTime = this.dateTime;
  
  if (interviewDateTime && interviewDateTime < now && this.status === 'upcoming') {
    this.status = 'completed';
    return true;
  }
  return false;
};

// Add resources based on interview type
interviewSchema.methods.addDefaultResources = function() {
  const resourceMap = {
    behavioral: [
      { title: 'STAR Method Guide', url: 'https://example.com/star-method', type: 'article' },
      { title: 'Common Behavioral Questions', url: 'https://example.com/behavioral-questions', type: 'video' }
    ],
    frontend: [
      { title: 'React Interview Questions', url: 'https://example.com/react-questions', type: 'article' },
      { title: 'CSS Flexbox Guide', url: 'https://example.com/flexbox', type: 'tutorial' }
    ],
    backend: [
      { title: 'Node.js Best Practices', url: 'https://example.com/nodejs', type: 'article' },
      { title: 'Database Design Patterns', url: 'https://example.com/database', type: 'video' }
    ],
    fullstack: [
      { title: 'System Design Interview', url: 'https://example.com/system-design', type: 'article' },
      { title: 'Full Stack Project Ideas', url: 'https://example.com/projects', type: 'tutorial' }
    ],
    dsa: [
      { title: 'Data Structures Guide', url: 'https://example.com/data-structures', type: 'article' },
      { title: 'Algorithm Patterns', url: 'https://example.com/algorithms', type: 'video' }
    ]
  };
  
  if (resourceMap[this.type] && this.resources.length === 0) {
    this.resources = resourceMap[this.type];
  }
};

module.exports = mongoose.model('Interview', interviewSchema);