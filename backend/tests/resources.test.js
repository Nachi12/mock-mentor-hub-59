const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/Resource');
jest.mock('jsonwebtoken');

const Resource = require('../models/Resource');

describe('Resource Routes', () => {
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
    const resourceRoutes = require('../routes/resources');
    app.use('/api/resources', resourceRoutes);
  });

  describe('GET /api/resources', () => {
    it('should get all resources', async () => {
      const mockResources = [
        {
          _id: '1',
          title: 'JavaScript Guide',
          type: 'technical',
          url: 'https://example.com/js',
          description: 'Complete JS guide'
        },
        {
          _id: '2',
          title: 'Interview Tips',
          type: 'behavioral',
          url: 'https://example.com/tips',
          description: 'Top interview tips'
        }
      ];

      Resource.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResources)
      });

      const response = await request(app)
        .get('/api/resources')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(Resource.find).toHaveBeenCalled();
    });

    it('should filter resources by type', async () => {
      const mockResources = [
        {
          _id: '1',
          title: 'JavaScript Guide',
          type: 'technical',
          url: 'https://example.com/js'
        }
      ];

      Resource.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResources)
      });

      const response = await request(app)
        .get('/api/resources?type=technical')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(Resource.find).toHaveBeenCalledWith({ type: 'technical' });
    });
  });

  describe('POST /api/resources', () => {
    it('should create a new resource', async () => {
      const newResource = {
        title: 'New Resource',
        type: 'technical',
        url: 'https://example.com/new',
        description: 'A new resource'
      };

      const mockSavedResource = {
        ...newResource,
        _id: '123',
        createdBy: mockUserId,
        save: jest.fn().mockResolvedValue(true)
      };

      Resource.mockImplementation(() => mockSavedResource);

      const response = await request(app)
        .post('/api/resources')
        .set('x-auth-token', mockToken)
        .send(newResource);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(newResource);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set('x-auth-token', mockToken)
        .send({
          title: 'Resource'
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should validate URL format', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set('x-auth-token', mockToken)
        .send({
          title: 'Resource',
          type: 'technical',
          url: 'not-a-valid-url',
          description: 'Description'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Please include a valid URL');
    });
  });

  describe('PUT /api/resources/:id', () => {
    it('should update an existing resource', async () => {
      const resourceId = '507f1f77bcf86cd799439011';
      const mockResource = {
        _id: resourceId,
        title: 'Original Title',
        createdBy: mockUserId,
        save: jest.fn().mockResolvedValue(true)
      };

      Resource.findById = jest.fn().mockResolvedValue(mockResource);

      const response = await request(app)
        .put(`/api/resources/${resourceId}`)
        .set('x-auth-token', mockToken)
        .send({
          title: 'Updated Title',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(mockResource.title).toBe('Updated Title');
      expect(mockResource.description).toBe('Updated description');
      expect(mockResource.save).toHaveBeenCalled();
    });

    it('should return 404 if resource not found', async () => {
      Resource.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/resources/507f1f77bcf86cd799439011')
        .set('x-auth-token', mockToken)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Resource not found');
    });
  });

  describe('DELETE /api/resources/:id', () => {
    it('should delete a resource', async () => {
      const resourceId = '507f1f77bcf86cd799439011';
      const mockResource = {
        _id: resourceId,
        createdBy: mockUserId,
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      Resource.findById = jest.fn().mockResolvedValue(mockResource);

      const response = await request(app)
        .delete(`/api/resources/${resourceId}`)
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Resource removed');
      expect(mockResource.deleteOne).toHaveBeenCalled();
    });

    it('should return 404 if resource not found', async () => {
      Resource.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/resources/507f1f77bcf86cd799439011')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Resource not found');
    });
  });
});