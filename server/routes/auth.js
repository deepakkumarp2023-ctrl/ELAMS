/**
 * Auth Routes — v1.0.0
 * Dual-mode: MongoDB when connected, in-memory fallback for tests/demo
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

const mockUsers = [];
const BCRYPT_ROUNDS = process.env.NODE_ENV === 'test' ? 4 : 12;
const dbReady = () => mongoose.connection.readyState === 1;

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['employee', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, role, department } = req.body;

    if (dbReady()) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
      const user = await User.create({ name, email, password, role: role || 'employee', department });
      const token = generateToken({ id: user._id, email: user.email, role: user.role, name: user.name });
      return res.status(201).json({ success: true, message: 'Registration successful', token, user });
    }

    // Mock mode
    const exists = mockUsers.find(u => u.email === email);
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const newUser = {
      id: `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name, email, password: hashed,
      role: role || 'employee',
      department: department || 'General',
      employeeId: `EMP${String(mockUsers.length + 1).padStart(4, '0')}`,
      totalLeaves: 20, usedLeaves: 0
    };
    mockUsers.push(newUser);
    const { password: _, ...safeUser } = newUser;
    const token = generateToken({ id: newUser.id, email, role: newUser.role, name });
    return res.status(201).json({ success: true, message: 'Registration successful', token, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;

    if (dbReady()) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const token = generateToken({ id: user._id, email: user.email, role: user.role, name: user.name });
      return res.json({ success: true, message: 'Login successful', token, user });
    }

    // Mock mode
    const user = mockUsers.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const { password: _, ...safeUser } = user;
    const token = generateToken({ id: user.id, email, role: user.role, name: user.name });
    return res.json({ success: true, message: 'Login successful', token, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Get Me ────────────────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    if (dbReady()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    }
    const user = mockUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
module.exports.mockUsers = mockUsers;
