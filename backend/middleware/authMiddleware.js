const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.isBanned) {
      return res.status(401).json({ message: 'User not found or banned' });
    }

    // Set default role if not present
    if (!user.role) {
      user.role = 'Sender';
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
