const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Interview = require('../models/Interview');
const { authenticate, isInterviewer } = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/interviews
// @desc    Get user's interviews
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query = { userId: req.userId };

    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }

    const interviews = await Interview.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('interviewerId', 'name email');

    const count = await Interview.countDocuments(query);

    // Auto-update status for past interviews
    for (let interview of interviews) {
      if (interview.updateStatus()) {
        await interview.save();
      }
    }

    res.json({
      interviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/interviews/:id
// @desc    Get single interview
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('interviewerId', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/interviews
// @desc    Schedule new interview
// @access  Private
router.post('/', [
  authenticate,
  body('type').isIn(['behavioral', 'fullstack', 'frontend', 'backend', 'dsa']).withMessage('Invalid interview type'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('interviewer').notEmpty().withMessage('Interviewer is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { type, date, time, interviewer, duration, notes } = req.body;

    // Check for scheduling conflicts
    const existingInterview = await Interview.findOne({
      userId: req.userId,
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingInterview) {
      return res.status(400).json({ message: 'You already have an interview scheduled at this time' });
    }

    // Create new interview
    const interview = new Interview({
      userId: req.userId,
      type,
      date: new Date(date),
      time,
      interviewer,
      duration: duration || 60,
      notes
    });

    // Add default resources
    interview.addDefaultResources();

    await interview.save();

    res.status(201).json({
      message: 'Interview scheduled successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/interviews/:id
// @desc    Update interview
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Prevent updating completed interviews
    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update completed interview' });
    }

    // Update allowed fields
    const allowedUpdates = ['date', 'time', 'interviewer', 'notes', 'status'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    res.json({
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/interviews/:id/complete
// @desc    Mark interview as completed (for students)
// @access  Private
router.put('/:id/complete', authenticate, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'completed';
    await interview.save();

    res.json({
      message: 'Interview marked as completed',
      interview
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/interviews/:id/feedback
// @desc    Add feedback to interview (for interviewers)
// @access  Private (Interviewer only)
router.put('/:id/feedback', [
  authenticate,
  isInterviewer,
  body('feedback').notEmpty().withMessage('Feedback is required'),
  body('score').isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('result').isIn(['passed', 'failed', 'pending']).withMessage('Invalid result'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { feedback, score, result, questions } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Update interview with feedback
    interview.feedback = feedback;
    interview.score = score;
    interview.result = result;
    interview.status = 'completed';
    
    if (questions && Array.isArray(questions)) {
      interview.questions = questions;
    }

    await interview.save();

    res.json({
      message: 'Feedback added successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/interviews/:id
// @desc    Cancel interview
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed interview' });
    }

    interview.status = 'cancelled';
    await interview.save();

    res.json({
      message: 'Interview cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/interviews/stats
// @desc    Get interview statistics
// @access  Private
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const stats = await Interview.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    const typeStats = await Interview.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      typeStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;