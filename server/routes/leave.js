/**
 * Leave Routes — v1.0.0
 * Dual-mode: MongoDB or in-memory mock
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Leave = require('../models/Leave');
const User = require('../models/User');

const mockLeaves = [];
const dbReady = () => mongoose.connection.readyState === 1;

// ── Apply Leave ───────────────────────────────────────────────────────────────
router.post('/', protect, [
  body('leaveType').isIn(['sick','casual','annual','maternity','paternity','emergency'])
    .withMessage('Invalid leave type'),
  body('startDate').isDate().withMessage('Valid start date required'),
  body('endDate').isDate().withMessage('Valid end date required'),
  body('reason').isLength({ min: 10 }).withMessage('Reason must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { leaveType, startDate, endDate, reason } = req.body;
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }

    if (dbReady()) {
      const leave = await Leave.create({ employee: req.user.id, leaveType, startDate, endDate, reason });
      await leave.populate('employee', 'name email department employeeId');
      return res.status(201).json({ success: true, message: 'Leave application submitted', leave });
    }

    // Mock mode
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000*60*60*24)) + 1;
    const leave = {
      _id: `leave_${Date.now()}`,
      employee: { _id: req.user.id, name: req.user.name, employeeId: 'EMP0001' },
      leaveType, startDate, endDate, totalDays, reason,
      status: 'pending', adminComment: '',
      createdAt: new Date().toISOString()
    };
    mockLeaves.push(leave);
    res.status(201).json({ success: true, message: 'Leave application submitted', leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Get Leaves ────────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    if (dbReady()) {
      const filter = req.user.role === 'admin' ? {} : { employee: req.user.id };
      const leaves = await Leave.find(filter)
        .populate('employee', 'name email department employeeId')
        .populate('reviewedBy', 'name').sort({ createdAt: -1 });
      return res.json({ success: true, count: leaves.length, leaves });
    }
    const leaves = req.user.role === 'admin'
      ? mockLeaves
      : mockLeaves.filter(l => l.employee._id === req.user.id || l.employee === req.user.id);
    res.json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Approve / Reject (Admin) ──────────────────────────────────────────────────
router.put('/:id', protect, adminOnly, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { status, adminComment } = req.body;

    if (dbReady()) {
      const leave = await Leave.findByIdAndUpdate(
        req.params.id,
        { status, adminComment: adminComment || '', reviewedBy: req.user.id, reviewedAt: new Date() },
        { new: true }
      ).populate('employee', 'name email');
      if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
      if (status === 'approved') {
        await User.findByIdAndUpdate(leave.employee._id, { $inc: { usedLeaves: leave.totalDays } });
      }
      return res.json({ success: true, message: `Leave ${status}`, leave });
    }

    // Mock mode
    const idx = mockLeaves.findIndex(l => l._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Leave not found' });
    mockLeaves[idx] = { ...mockLeaves[idx], status, adminComment: adminComment || '', reviewedAt: new Date().toISOString() };
    res.json({ success: true, message: `Leave ${status}`, leave: mockLeaves[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Cancel Leave ──────────────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    if (dbReady()) {
      const leave = await Leave.findOne({ _id: req.params.id, employee: req.user.id });
      if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
      if (leave.status !== 'pending') return res.status(400).json({ success: false, message: 'Can only cancel pending leaves' });
      await leave.deleteOne();
      return res.json({ success: true, message: 'Leave cancelled' });
    }
    const idx = mockLeaves.findIndex(l => l._id === req.params.id && l.employee._id === req.user.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Leave not found' });
    mockLeaves.splice(idx, 1);
    res.json({ success: true, message: 'Leave cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
module.exports.mockLeaves = mockLeaves;
