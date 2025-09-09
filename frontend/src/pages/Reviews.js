import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      // Fallback to dummy data if API fails
      setReviews([
        { id: 1, name: 'Alice', rating: 5, comment: 'Great service!' },
        { id: 2, name: 'Bob', rating: 4, comment: 'Reliable and fast.' },
        { id: 3, name: 'Charlie', rating: 3, comment: 'Good, but can improve.' },
      ]);
    }
  };

  const [rating, setRating] = React.useState(5);

  const handleAddReview = () => {
    if (!newReview.trim()) return;
    const review = {
      id: reviews.length + 1,
      name: user ? user.name : 'Anonymous',
      rating: rating,
      comment: newReview.trim(),
    };
    setReviews([review, ...reviews]);
    setNewReview('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mb-4 p-2 border rounded"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} Star{star > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <textarea
          rows="4"
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button
          onClick={handleAddReview}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border p-4 rounded shadow">
              <p className="font-semibold">{review.name}</p>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
              <p className="text-sm text-gray-500 mt-1">Delivery ID: {review.deliveryRequest ? review.deliveryRequest.deliveryId : 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;
