/**
 * Attendance API Tests
 * Tests for check-in, check-out, and attendance history
 */
const request = require('supertest');
const app = require('../index');

jest.setTimeout(30000);

describe('📋 Attendance API', () => {
  let employeeToken;

  beforeAll(async () => {
    const uid = Date.now();
    const res = await request(app).post('/api/auth/register').send({
      name: 'Attendance Emp',
      email: `att_${uid}@elams.com`,
      password: 'password123',
      role: 'employee'
    });
    employeeToken = res.body.token;
  });

  describe('POST /api/attendance/checkin', () => {
    it('should allow employee to check in', async () => {
      const res = await request(app)
        .post('/api/attendance/checkin')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.attendance.checkIn).toBeDefined();
    });

    it('should prevent double check-in', async () => {
      const res = await request(app)
        .post('/api/attendance/checkin')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already checked in/i);
    });
  });

  describe('PUT /api/attendance/checkout', () => {
    it('should allow employee to check out', async () => {
      const res = await request(app)
        .put('/api/attendance/checkout')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.attendance.checkOut).toBeDefined();
    });

    it('should prevent double check-out', async () => {
      const res = await request(app)
        .put('/api/attendance/checkout')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/attendance', () => {
    it('should return attendance history', async () => {
      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.attendance)).toBe(true);
      expect(res.body.attendance.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/attendance/today', () => {
    it('should return today\'s attendance status', async () => {
      const res = await request(app)
        .get('/api/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
