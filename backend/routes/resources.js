const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authenticate, isAdmin, optionalAuth } = require('../middleware/auth');

// @route   GET /api/resources
// @desc    Get all resources with filters
// @access  Public (with optional auth for premium content)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      type, 
      difficulty, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Hide premium content for non-authenticated users
    if (!req.user) {
      query.isPremium = false;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const resources = await Resource.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name');

    const count = await Resource.countDocuments(query);

    res.json({
      resources,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/resources/questions
// @desc    Get interview questions by category
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    const { category, difficulty, limit = 10, random = false } = req.query;

    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    let resources = await Resource.find(query)
      .select('questions category')
      .lean();

    // Flatten all questions
    let questions = [];
    resources.forEach(resource => {
      if (resource.questions && resource.questions.length > 0) {
        questions.push(...resource.questions.map(q => ({
          ...q,
          category: resource.category
        })));
      }
    });

    // Filter by difficulty if specified
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    // Randomize if requested
    if (random === 'true') {
      questions.sort(() => Math.random() - 0.5);
    }

    // Limit results
    questions = questions.slice(0, parseInt(limit));

    res.json({
      questions,
      total: questions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/resources/blogs
// @desc    Get blog posts
// @access  Public
router.get('/blogs', async (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;

    const query = { 
      isActive: true, 
      type: 'blog'
    };

    if (category) {
      query.category = category;
    }

    const blogs = await Resource.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name');

    const count = await Resource.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public (with auth check for premium)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!resource || !resource.isActive) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if resource is premium and user is not authenticated
    if (resource.isPremium && !req.user) {
      return res.status(403).json({ message: 'Premium content requires authentication' });
    }

    // Increment views
    await resource.incrementViews();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/resources
// @desc    Create new resource (Admin only)
// @access  Private (Admin)
router.post('/', [authenticate, isAdmin], async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      createdBy: req.userId
    });

    await resource.save();

    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource (Admin only)
// @access  Private (Admin)
router.put('/:id', [authenticate, isAdmin], async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'createdAt' && key !== 'views' && key !== 'likes') {
        resource[key] = req.body[key];
      }
    });

    await resource.save();

    res.json({
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/resources/:id/like
// @desc    Like a resource
// @access  Private
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.incrementLikes();

    res.json({
      message: 'Resource liked',
      likes: resource.likes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource (Admin only)
// @access  Private (Admin)
router.delete('/:id', [authenticate, isAdmin], async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Soft delete
    resource.isActive = false;
    await resource.save();

    res.json({
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/resources/stats/overview
// @desc    Get resource statistics
// @access  Private (Admin)
router.get('/stats/overview', [authenticate, isAdmin], async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments({ isActive: true });
    const totalViews = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    const totalLikes = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    const categoryStats = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalResources,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;