import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Auth API Endpoints (TDD Test Suite)', () => {
  beforeAll(async () => {
    // Clear users before test run
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return user info + token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'John Auto',
          email: 'john@example.com',
          password: 'password123',
          role: 'USER',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('john@example.com');
      expect(res.body.user.role).toBe('USER');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration if email is already registered', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'John Duplicate',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists|in use/i);
    });

    it('should reject registration with invalid payload', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('john@example.com');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    it('should reject login for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });
});
