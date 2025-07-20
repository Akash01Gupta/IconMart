const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and attach user to req.user
exports.protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      console.warn('[Auth Protect] No token provided in header');
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('[Auth Protect] JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or malformed' });
    }

    if (!decoded || !decoded.id) {
      console.warn('[Auth Protect] Invalid token payload structure');
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Find user and attach to request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn('[Auth Protect] User not found for decoded token');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Protect] Unexpected error:', error.message);
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

// Middleware to restrict access to specific roles
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized: user or role missing' });
    }

    const userRole = req.user.role;
    console.log(`[Auth] User Role: ${userRole}`);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied: role '${userRole}' not permitted`,
      });
    }

    next();
  };
};

