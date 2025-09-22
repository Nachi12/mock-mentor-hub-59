const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const User = require('../models/User');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a fresh express app for each test
    const express = require('express');
    app = express();
    app.use(express.json());
    const authRoutes = require('../routes/auth');
    app.use('/api/auth', authRoutes);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.mockImplementation(() => mockUser);
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      jwt.sign = jest.fn().mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mockToken');
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mockToken');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return error if user already exists', async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with correct credentials', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mockToken');
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mockToken');
    });

    it('should return error for invalid credentials', async () => {
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Invalid Credentials');
    });

    it('should return error when password does not match', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Invalid Credentials');
    });
  });

  describe('POST /api/auth/google', () => {
    it('should authenticate user with Google token', async () => {
      const mockUser = {
        _id: '123',
        googleId: 'google123',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock Google OAuth verification
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          sub: 'google123',
          email: 'test@example.com',
          name: 'Test User'
        })
      });

      User.findOne = jest.fn().mockResolvedValue(null);
      User.mockImplementation(() => mockUser);
      jwt.sign = jest.fn().mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mockToken');
      });

      const response = await request(app)
        .post('/api/auth/google')
        .send({
          token: 'googleToken123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mockToken');
    });
  });
});