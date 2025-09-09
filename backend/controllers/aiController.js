const DeliveryRequest = require('../models/DeliveryRequest');
const TravelerTrip = require('../models/TravelerTrip');
const Review = require('../models/Review');
const User = require('../models/User');
const fetch = require('node-fetch');  // Added import for fetch in Node.js

// Function to get AI answer using Ollama
async function getAIAnswer(question) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // or any other model you have installed in Ollama
        prompt: `You are an expert AI assistant for EasyDelivery Bangladesh, a comprehensive delivery platform connecting senders with travelers across Bangladesh. You have deep knowledge about Bangladesh's geography, transportation, and delivery needs.

BANGLADESH CONTEXT:
- Major cities: Dhaka, Chittagong, Khulna, Rajshahi, Sylhet, Barisal, Rangpur
- Popular routes: Dhaka-Chittagong (highway), Dhaka-Sylhet (air/road), inter-district routes
- Transportation: Buses, trains, domestic flights, rickshaws, CNG auto-rickshaws
- Common delivery items: Documents, electronics, clothing, food items, medicines
- Cultural considerations: Respect for local customs, timely delivery importance
- Payment methods: bKash, Nagad, Rocket (popular mobile banking), cash on delivery
- Business hours: Generally 9 AM - 6 PM, but flexible for urgent deliveries

PLATFORM FEATURES:
- Senders can post delivery requests with details like weight, deadline, pickup/dropoff locations, and cost
- Travelers can post trips with their travel routes, available weight capacity, and cost per kg
- Smart matching system finds optimal traveler trips for delivery requests
- Real-time tracking and messaging between senders and travelers
- Wallet system for secure payments (supports bKash, Nagad integration)
- Review and rating system for quality assurance
- Fraud reporting system for safety
- Admin dashboard for platform management

DELIVERY PROCESS:
1. Sender creates delivery request with details (pickup from home/office, delivery to recipient)
2. AI matches with suitable traveler trips (considering routes, capacity, reliability)
3. Traveler accepts the delivery request and confirms availability
4. Payment is held in escrow until delivery completion
5. Real-time updates and messaging throughout the journey
6. Delivery completion with OTP verification and automatic payment release
7. Both parties can leave reviews and ratings

BANGLADESH-SPECIFIC GUIDANCE:
- Suggest realistic delivery times based on Bangladesh's road conditions
- Consider weather impacts (monsoon season affects deliveries)
- Recommend insurance for valuable items
- Advise on packaging requirements for different item types
- Suggest optimal pickup/delivery times considering traffic patterns
- Provide guidance on customs for inter-district movements

Always provide helpful, accurate information about the platform with Bangladesh context. If you don't know something specific, suggest contacting support or checking the help documentation. Be friendly, professional, and culturally appropriate for Bangladesh users.

User question: ${question}

Please provide a helpful and accurate response:`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama API error:', error);
    return 'I apologize, but I\'m experiencing a technical issue right now. Please try again in a moment, or contact our support team for immediate assistance. Make sure Ollama is running locally on port 11434.';
  }
}

async function getSmartMatches(userId) {
  // Fetch delivery requests for the user
  const deliveryRequests = await DeliveryRequest.find({ user: userId, status: 'Pending' });
  // Fetch active traveler trips
  const travelerTrips = await TravelerTrip.find({ status: 'Active' });

  // Fetch reviews to calculate average ratings for travelers
  const travelerRatings = {};
  const reviews = await Review.find({});
  reviews.forEach((review) => {
    const id = review.reviewee.toString();
    if (!travelerRatings[id]) {
      travelerRatings[id] = { total: 0, count: 0 };
    }
    travelerRatings[id].total += review.rating;
    travelerRatings[id].count += 1;
  });

  // Calculate average ratings
  Object.keys(travelerRatings).forEach((id) => {
    travelerRatings[id].avg = travelerRatings[id].total / travelerRatings[id].count;
  });

  // Prepare prompt for Ollama AI
  const deliveryRequestsData = deliveryRequests.map((req) => ({
    id: req._id.toString(),
    from: req.from,
    to: req.to,
    weight: req.weight,
    deadline: req.deadline,
    cost: req.cost,
  }));

  const travelerTripsData = travelerTrips.map((trip) => ({
    id: trip._id.toString(),
    from: trip.from,
    to: trip.to,
    date: trip.date,
    maxWeight: trip.maxWeight,
    availableWeight: trip.availableWeight,
    costPerKg: trip.costPerKg,
    rating: travelerRatings[trip.user.toString()] ? travelerRatings[trip.user.toString()].avg : null,
  }));

  const prompt = `
You are an AI assistant for matching delivery requests with traveler trips. Given the following delivery requests and traveler trips, suggest the best matches considering location, weight capacity, deadlines, cost, and traveler ratings.

Delivery Requests:
${JSON.stringify(deliveryRequestsData, null, 2)}

Traveler Trips:
${JSON.stringify(travelerTripsData, null, 2)}

Return a JSON array of objects with deliveryRequestId and travelerTripId for the best matches.
`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    // Parse AI response to get matches
    let aiMatches = [];
    try {
      aiMatches = JSON.parse(data.response);
    } catch (err) {
      console.error('Failed to parse AI response:', err);
      return [];
    }

    // Map AI matches to full objects
    const matches = [];
    aiMatches.forEach((match) => {
      const deliveryRequest = deliveryRequests.find((req) => req._id.toString() === match.deliveryRequestId);
      const travelerTrip = travelerTrips.find((trip) => trip._id.toString() === match.travelerTripId);
      if (deliveryRequest && travelerTrip) {
        matches.push({ deliveryRequest, travelerTrip });
      }
    });

    return matches;
  } catch (error) {
    console.error('Error in AI smart matching:', error);
    // Fallback to simple matching if AI fails
    const matches = [];

    deliveryRequests.forEach((request) => {
      travelerTrips.forEach((trip) => {
        if (
          (trip.from.toLowerCase() === request.from.toLowerCase() && trip.to.toLowerCase() === request.to.toLowerCase()) ||
          (trip.from.toLowerCase() === request.to.toLowerCase() && trip.to.toLowerCase() === request.from.toLowerCase())
        ) {
          matches.push({
            deliveryRequest: request,
            travelerTrip: trip,
          });
        }
      });
    });

    return matches;
  }
}

exports.smartMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const matches = await getSmartMatches(userId);
    res.json(matches);
  } catch (error) {
    console.error('Error in smartMatch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    const answer = await getAIAnswer(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error in askAI:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
