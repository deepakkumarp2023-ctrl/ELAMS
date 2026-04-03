/**
 * Auth API Tests
 * Tests for registration, login, and JWT authentication
 */
const request = require('supertest');
const app = require('../index');

jest.setTimeout(30000); // 30s timeout for all tests in this file

describe('🔐 Auth API', () => {
  let authToken;
  const testUser = {
    name: 'Test Employee',
    email: `test_${Date.now()}@elams.com`,
    password: 'password123',
    role: 'employee',
    department: 'Engineering'
  };

  // ─── Health Check ──────────────────────────────────────────────────────────
  describe('GET /api/health', () => {
    it('should return 200 with status OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.version).toBe('1.0.0');
    }, 10000);
  });

  // ─── Registration ──────────────────────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.password).toBeUndefined(); // password must not be exposed
      authToken = res.body.token;
    });

    it('should fail registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'notanemail' });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'new@test.com', password: '123' });

      expect(res.statusCode).toBe(400);
    });

    it('should fail with missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test2@test.com', password: 'password123' });

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── Login ─────────────────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      authToken = res.body.token;
    });

    it('should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@elams.com', password: 'password123' });

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── Protected Route ───────────────────────────────────────────────────────
  describe('GET /api/auth/me', () => {
    it('should return user data with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');
      expect(res.statusCode).toBe(401);
    });
  });
});
