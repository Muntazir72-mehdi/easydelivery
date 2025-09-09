const mongoose = require('mongoose');
const User = require('./models/User');
const DeliveryRequest = require('./models/DeliveryRequest');
const TravelerTrip = require('./models/TravelerTrip');
const FraudReport = require('./models/FraudReport');
const Wallet = require('./models/Wallet');

require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/easydelivery';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected for seeding dummy data');

  // Clear existing data
  await User.deleteMany({});
  await DeliveryRequest.deleteMany({});
  await TravelerTrip.deleteMany({});
  await FraudReport.deleteMany({});
  await Wallet.deleteMany({});

  // Create dummy users
  const users = await User.insertMany([
    { name: 'Alice Admin', email: 'alice@admin.com', password: 'password', role: 'Admin', isBanned: false },
    { name: 'Bob Sender', email: 'bob@sender.com', password: 'password', role: 'Sender', isBanned: false },
    { name: 'Charlie Traveler', email: 'charlie@traveler.com', password: 'password', role: 'Traveler', isBanned: false },
  ]);

  // Create dummy delivery requests
  const deliveries = await DeliveryRequest.insertMany([
    {
      title: 'Package 1',
      user: users[1]._id,
      status: 'Requested',
      cost: 50,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      weight: 2,
      to: '123 Destination St',
      from: '456 Origin Ave',
      createdAt: new Date(),
    },
    {
      title: 'Package 2',
      user: users[1]._id,
      status: 'In Transit',
      cost: 75,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      weight: 5,
      to: '789 Destination Blvd',
      from: '101 Origin Rd',
      createdAt: new Date(),
    },
  ]);

  // Create dummy traveler trips
  const trips = await TravelerTrip.insertMany([
    {
      user: users[2]._id,
      from: 'City A',
      to: 'City B',
      date: new Date(),
      maxWeight: 20,
      availableWeight: 15,
      costPerKg: 10,
      description: 'Trip from City A to City B',
      status: 'Active',
      createdAt: new Date(),
    },
  ]);

  // Create dummy fraud reports
  const fraudReports = await FraudReport.insertMany([
    { reportedBy: users[1]._id, delivery: deliveries[0]._id, description: 'Suspicious activity', status: 'Pending', createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Create dummy wallets
  const wallets = await Wallet.insertMany([
    { user: users[1]._id, balance: 100 },
    { user: users[2]._id, balance: 50 },
  ]);

  console.log('Dummy data seeded successfully');
  process.exit(0);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
