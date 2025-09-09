 const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register user with email and password
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first validation error message for better frontend display
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password, role } = req.body;

  // Validate role to be one of the allowed roles
  const allowedRoles = ['Sender', 'Traveler', 'Admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(', ')}` });
  }

  // Admin email domain validation
  if (role === 'Admin' && !email.endsWith('@admin.ac.bd')) {
    return res.status(400).json({ message: 'Admin email must end with @admin.ac.bd' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user with email and password
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Please use Google login or reset your password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send OTP for login
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found in database' });
    }

    // Only send OTP if not already sent and not expired
    if (user.otp && user.otpExpires > new Date()) {
      return res.status(400).json({ message: 'OTP already sent. Please check your email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: 'Email service not configured. Please contact support.' });
    }

    // Send OTP via email using SMTP service from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for EasyDelivery Login',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google OAuth strategy - only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        role: 'Sender', // Default role
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  console.warn('Google OAuth credentials not found. Google OAuth disabled.');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth routes
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });

exports.googleAuthSuccess = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`http://localhost:3000/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  }))}`);
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
