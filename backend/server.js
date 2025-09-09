require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

const FRONTEND_PORT = process.env.FRONTEND_PORT || '3000';

// Middleware
const corsOptions = {
  origin: [`http://localhost:${FRONTEND_PORT}`],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Connect to MongoDB
let mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/easydelivery';

if (mongoURI.includes('localhost27017')) {
  mongoURI = mongoURI.replace('localhost27017', 'localhost:27017');
}

/**
 * Fix MongoDB URI to remove invalid characters but keep the colon after 'mongodb' prefix.
 * The previous regex was incorrect and caused invalid namespace errors.
 * This fix ensures only extra colons after the port number are removed.
 */
if (mongoURI.includes('mongodb://')) {
  const parts = mongoURI.split('mongodb://');
  const prefix = parts[0] + 'mongodb://';
  let rest = parts[1];
  // Remove any colon that is not part of the port number (e.g., after '27017')
  rest = rest.replace(/:(?![0-9]{1,5}\/?)/g, '');
  mongoURI = prefix + rest;
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Import routes
const authRoutes = require('./routes/auth');
const deliveryRoutes = require('./routes/delivery');
const travelerRoutes = require('./routes/traveler');
const messageRoutes = require('./routes/message');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');

const path = require('path');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/traveler', travelerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);  // Added admin routes mounting
app.use('/api/ai', aiRoutes);  // Added AI routes mounting

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Basic route
  app.get('/', (req, res) => {
    res.send('Easydelivery Backend API is running');
  });
}

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
