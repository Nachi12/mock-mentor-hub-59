const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/Interview');
jest.mock('jsonwebtoken');

const Interview = require('../models/Interview');

describe('Interview Routes', () => {
  let app;
  const mockToken = 'Bearer mockToken123';
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock JWT verification
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(null, { user: { id: mockUserId } });
    });

    // Create a fresh express app for each test
    const express = require('express');
    app = express();
    app.use(express.json());
    const interviewRoutes = require('../routes/interviews');
    app.use('/api/interviews', interviewRoutes);
  });

  describe('GET /api/interviews', () => {
    it('should get all interviews for authenticated user', async () => {
      const mockInterviews = [
        {
          _id: '1',
          title: 'Frontend Interview',
          date: new Date(),
          time: '10:00 AM',
          user: mockUserId
        },
        {
          _id: '2',
          title: 'Backend Interview',
          date: new Date(),
          time: '2:00 PM',
          user: mockUserId
        }
      ];

      Interview.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockInterviews)
      });

      const response = await request(app)
        .get('/api/interviews')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(Interview.find).toHaveBeenCalledWith({ user: mockUserId });
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/interviews');

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('POST /api/interviews', () => {
    it('should create a new interview', async () => {
      const newInterview = {
        title: 'Technical Interview',
        company: 'Tech Corp',
        date: '2024-12-25',
        time: '3:00 PM',
        type: 'technical',
        description: 'Technical discussion'
      };

      const mockSavedInterview = {
        ...newInterview,
        _id: '123',
        user: mockUserId,
        save: jest.fn().mockResolvedValue(true)
      };

      Interview.mockImplementation(() => mockSavedInterview);

      const response = await request(app)
        .post('/api/interviews')
        .set('x-auth-token', mockToken)
        .send(newInterview);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(newInterview);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/interviews')
        .set('x-auth-token', mockToken)
        .send({
          title: 'Interview'
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/interviews/:id', () => {
    it('should update an existing interview', async () => {
      const interviewId = '507f1f77bcf86cd799439011';
      const mockInterview = {
        _id: interviewId,
        title: 'Original Title',
        user: mockUserId,
        save: jest.fn().mockResolvedValue(true)
      };

      Interview.findById = jest.fn().mockResolvedValue(mockInterview);

      const response = await request(app)
        .put(`/api/interviews/${interviewId}`)
        .set('x-auth-token', mockToken)
        .send({
          title: 'Updated Title',
          time: '4:00 PM'
        });

      expect(response.status).toBe(200);
      expect(mockInterview.title).toBe('Updated Title');
      expect(mockInterview.time).toBe('4:00 PM');
      expect(mockInterview.save).toHaveBeenCalled();
    });

    it('should return 404 if interview not found', async () => {
      Interview.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/interviews/507f1f77bcf86cd799439011')
        .set('x-auth-token', mockToken)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Interview not found');
    });

    it('should return 401 if user is not authorized', async () => {
      const mockInterview = {
        _id: '123',
        user: 'differentUserId'
      };

      Interview.findById = jest.fn().mockResolvedValue(mockInterview);

      const response = await request(app)
        .put('/api/interviews/123')
        .set('x-auth-token', mockToken)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('User not authorized');
    });
  });

  describe('DELETE /api/interviews/:id', () => {
    it('should delete an interview', async () => {
      const interviewId = '507f1f77bcf86cd799439011';
      const mockInterview = {
        _id: interviewId,
        user: mockUserId,
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      Interview.findById = jest.fn().mockResolvedValue(mockInterview);

      const response = await request(app)
        .delete(`/api/interviews/${interviewId}`)
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Interview removed');
      expect(mockInterview.deleteOne).toHaveBeenCalled();
    });

    it('should return 404 if interview not found', async () => {
      Interview.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/interviews/507f1f77bcf86cd799439011')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Interview not found');
    });
  });
});