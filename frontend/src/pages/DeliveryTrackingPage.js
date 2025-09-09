import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import DeliveryTracking from '../components/DeliveryTracking';

const DeliveryTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(id || '');
  const [currentDeliveryId, setCurrentDeliveryId] = useState(id);

  const handleSearch = () => {
    if (searchId.trim()) {
      setCurrentDeliveryId(searchId.trim());
      navigate(`/delivery-tracking/${searchId.trim()}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-4"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-display font-semibold text-primary-700 dark:text-primary-300">
                Delivery Tracking
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Delivery ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input-field pl-10 w-64"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-600" />
              </div>
              <button
                onClick={handleSearch}
                className="btn-primary"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentDeliveryId ? (
          <DeliveryTracking
            deliveryId={currentDeliveryId}
            token={localStorage.getItem('token')}
          />
        ) : (
          <div className="card text-center py-12">
            <div className="max-w-md mx-auto">
              <FaSearch className="text-6xl text-secondary-400 dark:text-secondary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                Track Your Delivery
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Enter your delivery ID above to track your package in real-time
              </p>
              <div className="text-sm text-secondary-500 dark:text-secondary-500">
                <p>Need help finding your delivery ID?</p>
                <p>Check your email or contact our support team.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
