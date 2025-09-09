import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlane, FaMapMarkerAlt, FaWeight, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const PostTrip = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    maxWeight: '',
    costPerKg: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/traveler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          maxWeight: parseFloat(formData.maxWeight),
          costPerKg: parseFloat(formData.costPerKg)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to post trip');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to post trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Post Your Travel Trip</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Trip Details</h2>
            <p className="text-gray-600">Share your travel plans to help deliver packages along your route</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="from"
                    name="from"
                    placeholder="Departure city"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.from}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="to"
                    name="to"
                    placeholder="Destination city"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.to}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="maxWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Weight (kg)
                </label>
                <div className="relative">
                  <FaWeight className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    id="maxWeight"
                    name="maxWeight"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.maxWeight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="costPerKg" className="block text-sm font-medium text-gray-700 mb-1">
                Cost per kg ($)
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  id="costPerKg"
                  name="costPerKg"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.costPerKg}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                placeholder="Any additional information about your trip..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Trip'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostTrip;
