/**
 * Leave API Tests
 * Tests for leave application, listing, and admin actions
 */
const request = require('supertest');
const app = require('../index');

jest.setTimeout(30000);

describe('🌴 Leave API', () => {
  let employeeToken, adminToken, leaveId;

  // Setup: register + login users
  beforeAll(async () => {
    const uid = Date.now();

    // Register employee
    const empRes = await request(app).post('/api/auth/register').send({
      name: 'Leave Employee',
      email: `leave_emp_${uid}@elams.com`,
      password: 'password123',
      role: 'employee'
    });
    employeeToken = empRes.body.token;

    // Register admin
    const admRes = await request(app).post('/api/auth/register').send({
      name: 'Leave Admin',
      email: `leave_adm_${uid}@elams.com`,
      password: 'password123',
      role: 'admin'
    });
    adminToken = admRes.body.token;
  });

  // ─── Apply for Leave ───────────────────────────────────────────────────────
  describe('POST /api/leaves', () => {
    it('should allow employee to apply for leave', async () => {
      const res = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveType: 'sick',
          startDate: '2025-03-10',
          endDate: '2025-03-12',
          reason: 'Fever and cold - doctor recommended rest for 3 days'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.leave.status).toBe('pending');
      leaveId = res.body.leave._id;
    });

    it('should reject leave with short reason', async () => {
      const res = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveType: 'casual',
          startDate: '2025-03-15',
          endDate: '2025-03-15',
          reason: 'short'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should reject leave without authentication', async () => {
      const res = await request(app)
        .post('/api/leaves')
        .send({ leaveType: 'sick', startDate: '2025-03-10', endDate: '2025-03-12', reason: 'Test reason that is long enough' });

      expect(res.statusCode).toBe(401);
    });

    it('should reject invalid leave type', async () => {
      const res = await request(app)
        .post('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ leaveType: 'vacation', startDate: '2025-03-10', endDate: '2025-03-12', reason: 'Test reason long enough' });

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── Get Leaves ────────────────────────────────────────────────────────────
  describe('GET /api/leaves', () => {
    it('should return leaves for authenticated employee', async () => {
      const res = await request(app)
        .get('/api/leaves')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.leaves)).toBe(true);
    });

    it('should return all leaves for admin', async () => {
      const res = await request(app)
        .get('/api/leaves')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ─── Admin Actions ─────────────────────────────────────────────────────────
  describe('PUT /api/leaves/:id', () => {
    it('should allow admin to approve a leave', async () => {
      if (!leaveId) return;
      const res = await request(app)
        .put(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved', adminComment: 'Approved. Get well soon.' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.leave.status).toBe('approved');
    });

    it('should prevent employee from approving a leave', async () => {
      if (!leaveId) return;
      const res = await request(app)
        .put(`/api/leaves/${leaveId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ status: 'approved' });

      expect(res.statusCode).toBe(403);
    });
  });
});
