/**
 * Attendance Model
 * Tracks daily check-in/check-out records
 */
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format for easy querying
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'on-leave'],
    default: 'present'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Calculate total hours when checking out
attendanceSchema.methods.calculateHours = function () {
  if (this.checkIn && this.checkOut) {
    const diff = this.checkOut - this.checkIn;
    this.totalHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
    if (this.totalHours < 4) this.status = 'half-day';
    else this.status = 'present';
  }
};

module.exports = mongoose.model('Attendance', attendanceSchema);
