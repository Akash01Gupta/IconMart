const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  roles: { type: [String], default: [] },
  phone: { type: String, trim: true, default: null },
  address: { type: String, trim: true, default: null },
  profileImage: { type: String, trim: true, default: null },
  isEmailVerified: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  activityLogs: { type: [ActivityLogSchema], default: [] },
}, { timestamps: true });

// ❌ Remove this line: userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
