const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/authController');
const walletRoutes = require('./wallet');


// Registration route with validation
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Sender', 'Traveler', 'Admin']).withMessage('Role must be Sender, Traveler, or Admin'),
  ],
  authController.register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Send OTP route
router.post(
  '/send-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  authController.sendOTP
);

// Verify OTP route
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  authController.verifyOTP
);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback, authController.googleAuthSuccess);

// Get current user profile
router.get('/me', require('../middleware/authMiddleware'), authController.getMe);

router.use('/wallet', walletRoutes);

module.exports = router;
