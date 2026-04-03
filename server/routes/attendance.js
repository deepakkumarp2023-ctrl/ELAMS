/**
 * Attendance Routes — v1.0.0
 * Dual-mode: MongoDB or in-memory mock
 */
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Attendance = require('../models/Attendance');

const mockAttendance = [];
const dbReady = () => mongoose.connection.readyState === 1;
const todayStr = () => new Date().toISOString().split('T')[0];

// ── Check In ──────────────────────────────────────────────────────────────────
router.post('/checkin', protect, async (req, res) => {
  try {
    const today = todayStr();
    if (dbReady()) {
      const existing = await Attendance.findOne({ employee: req.user.id, date: today });
      if (existing && existing.checkIn) return res.status(400).json({ success: false, message: 'Already checked in today' });
      const record = existing
        ? await Attendance.findByIdAndUpdate(existing._id, { checkIn: new Date() }, { new: true })
        : await Attendance.create({ employee: req.user.id, date: today, checkIn: new Date() });
      return res.status(201).json({ success: true, message: 'Checked in successfully', attendance: record });
    }
    const existing = mockAttendance.find(a => a.employee === req.user.id && a.date === today);
    if (existing && existing.checkIn) return res.status(400).json({ success: false, message: 'Already checked in today' });
    const record = { _id: `att_${Date.now()}`, employee: req.user.id, date: today, checkIn: new Date().toISOString(), checkOut: null, totalHours: 0, status: 'present' };
    mockAttendance.push(record);
    res.status(201).json({ success: true, message: 'Checked in successfully', attendance: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Check Out ─────────────────────────────────────────────────────────────────
router.put('/checkout', protect, async (req, res) => {
  try {
    const today = todayStr();
    if (dbReady()) {
      const record = await Attendance.findOne({ employee: req.user.id, date: today });
      if (!record || !record.checkIn) return res.status(400).json({ success: false, message: 'Please check in first' });
      if (record.checkOut) return res.status(400).json({ success: false, message: 'Already checked out today' });
      record.checkOut = new Date();
      record.calculateHours();
      await record.save();
      return res.json({ success: true, message: 'Checked out successfully', attendance: record });
    }
    const idx = mockAttendance.findIndex(a => a.employee === req.user.id && a.date === today);
    if (idx === -1 || !mockAttendance[idx].checkIn) return res.status(400).json({ success: false, message: 'Please check in first' });
    if (mockAttendance[idx].checkOut) return res.status(400).json({ success: false, message: 'Already checked out today' });
    const checkOut = new Date().toISOString();
    const hours = parseFloat(((new Date(checkOut) - new Date(mockAttendance[idx].checkIn)) / (1000*60*60)).toFixed(2));
    mockAttendance[idx] = { ...mockAttendance[idx], checkOut, totalHours: hours };
    res.json({ success: true, message: 'Checked out successfully', attendance: mockAttendance[idx] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Get Attendance ────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    if (dbReady()) {
      const filter = req.user.role === 'admin' ? {} : { employee: req.user.id };
      const records = await Attendance.find(filter)
        .populate('employee', 'name email department')
        .sort({ date: -1 }).limit(90);
      return res.json({ success: true, count: records.length, attendance: records });
    }
    const records = req.user.role === 'admin'
      ? mockAttendance
      : mockAttendance.filter(a => a.employee === req.user.id);
    res.json({ success: true, count: records.length, attendance: [...records].reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Today Status ──────────────────────────────────────────────────────────────
router.get('/today', protect, async (req, res) => {
  try {
    const today = todayStr();
    if (dbReady()) {
      const record = await Attendance.findOne({ employee: req.user.id, date: today });
      return res.json({ success: true, today, attendance: record || null });
    }
    const record = mockAttendance.find(a => a.employee === req.user.id && a.date === today) || null;
    res.json({ success: true, today, attendance: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
