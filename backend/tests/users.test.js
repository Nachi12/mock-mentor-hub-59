const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const User = require('../models/User');

describe('User Routes', () => {
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
    const userRoutes = require('../routes/users');
    app.use('/api/users', userRoutes);
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const mockUser = {
        _id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date()
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const response = await request(app)
        .get('/api/users/me')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Test User',
        email: 'test@example.com'
      });
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');
    });

    it('should return 404 if user not found', async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/api/users/me')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('User not found');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const mockUser = {
        _id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/api/users/me')
        .set('x-auth-token', mockToken)
        .send({
          name: 'Updated Name',
          phone: '1234567890'
        });

      expect(response.status).toBe(200);
      expect(mockUser.name).toBe('Updated Name');
      expect(mockUser.phone).toBe('1234567890');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should not allow email update', async () => {
      const mockUser = {
        _id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/api/users/me')
        .set('x-auth-token', mockToken)
        .send({
          email: 'newemail@example.com'
        });

      expect(response.status).toBe(200);
      expect(mockUser.email).toBe('test@example.com'); // Email should not change
    });
  });

  describe('PUT /api/users/password', () => {
    it('should update user password', async () => {
      const mockUser = {
        _id: mockUserId,
        password: 'oldHashedPassword',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('newHashedPassword');

      const response = await request(app)
        .put('/api/users/password')
        .set('x-auth-token', mockToken)
        .send({
          currentPassword: 'oldPassword',
          newPassword: 'newPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Password updated successfully');
      expect(mockUser.password).toBe('newHashedPassword');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return error for incorrect current password', async () => {
      const mockUser = {
        _id: mockUserId,
        password: 'hashedPassword'
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const response = await request(app)
        .put('/api/users/password')
        .set('x-auth-token', mockToken)
        .send({
          currentPassword: 'wrongPassword',
          newPassword: 'newPassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Current password is incorrect');
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('x-auth-token', mockToken)
        .send({
          currentPassword: 'oldPassword',
          newPassword: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Please enter a password with 6 or more characters');
    });
  });

  describe('DELETE /api/users/me', () => {
    it('should delete user account', async () => {
      const mockUser = {
        _id: mockUserId,
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .delete('/api/users/me')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('User deleted');
      expect(mockUser.deleteOne).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/users/me')
        .set('x-auth-token', mockToken);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('User not found');
    });
  });
});