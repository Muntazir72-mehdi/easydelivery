 const Review = require('../models/Review');
const User = require('../models/User');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { deliveryRequestId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    // Find delivery request and validate
    const deliveryRequest = await require('../models/DeliveryRequest').findById(deliveryRequestId);
    if (!deliveryRequest) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }

    // Determine reviewee (other party)
    let revieweeId;
    if (req.user._id.equals(deliveryRequest.user)) {
      revieweeId = deliveryRequest.traveler;
    } else if (req.user._id.equals(deliveryRequest.traveler)) {
      revieweeId = deliveryRequest.user;
    } else {
      return res.status(403).json({ message: 'You are not authorized to review this delivery' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      deliveryRequest: deliveryRequestId,
      reviewer: reviewerId,
      reviewee: revieweeId
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this delivery' });
    }

    const review = new Review({
      deliveryRequest: deliveryRequestId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment
    });

    await review.save();

    // Update reviewee average rating and total reviews
    const reviews = await Review.find({ reviewee: revieweeId });
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    await User.findByIdAndUpdate(revieweeId, {
      averageRating,
      totalReviews
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// Get reviews for a user
exports.getReviewsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};
