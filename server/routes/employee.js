/**
 * Employee Routes (Admin) — v1.0.0
 */
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

const dbReady = () => mongoose.connection.readyState === 1;

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    if (dbReady()) {
      const [totalEmployees, pendingLeaves, approvedLeaves, todayPresent] = await Promise.all([
        User.countDocuments({ role: 'employee' }),
        Leave.countDocuments({ status: 'pending' }),
        Leave.countDocuments({ status: 'approved' }),
        Attendance.countDocuments({ date: new Date().toISOString().split('T')[0] })
      ]);
      return res.json({ success: true, stats: { totalEmployees, pendingLeaves, approvedLeaves, todayPresent } });
    }
    res.json({ success: true, stats: { totalEmployees: 0, pendingLeaves: 0, approvedLeaves: 0, todayPresent: 0 } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (dbReady()) {
      const employees = await User.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: employees.length, employees });
    }
    res.json({ success: true, count: 0, employees: [] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (dbReady()) {
      const employee = await User.findById(req.params.id).select('-password');
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
      return res.json({ success: true, employee });
    }
    res.status(404).json({ success: false, message: 'Employee not found' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
