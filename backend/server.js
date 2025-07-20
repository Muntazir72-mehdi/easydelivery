require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const FRONTEND_PORT = process.env.FRONTEND_PORT || '3000';

// Middleware
const corsOptions = {
  origin: [`http://localhost:${FRONTEND_PORT}`],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/easydelivery';
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

const path = require('path');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes);

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

