const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach the decoded user (id and role) to req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};



// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    // Ensure the user is attached to the request
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Authorization denied. No user information.' });
    }

    // Query the database to verify if the user is an admin
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (err) {
    console.error('Error verifying admin:', err.message);
    res.status(500).json({ msg: 'Server error during admin verification.' });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
