import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRoute, FaClock, FaCheckCircle, FaTruck, FaBox } from 'react-icons/fa';

const DeliveryTracking = ({ deliveryId, token }) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ lat: 23.8103, lng: 90.4125 }); // Dhaka coordinates

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryDetails();
    }
  }, [deliveryId]);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5003/api/delivery/${deliveryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch delivery details');
      }
      const data = await response.json();
      setDelivery(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="text-warning-500" />;
      case 'In Transit':
        return <FaTruck className="text-primary-500" />;
      case 'Delivered':
        return <FaCheckCircle className="text-success-500" />;
      default:
        return <FaBox className="text-secondary-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Transit':
        return 'status-in-transit';
      case 'Delivered':
        return 'status-delivered';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="card">
        <p className="text-secondary-600 dark:text-secondary-400">No delivery found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delivery Info Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-semibold text-primary-700 dark:text-primary-300">
            Delivery Tracking
          </h2>
          <span className={`status-badge ${getStatusColor(delivery.status)}`}>
            {getStatusIcon(delivery.status)}
            <span className="ml-2">{delivery.status}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-secondary-700 dark:text-secondary-300">Package Details</h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-1"><strong>Title:</strong> {delivery.title}</p>
            <p className="text-secondary-600 dark:text-secondary-400 mb-1"><strong>From:</strong> {delivery.from}</p>
            <p className="text-secondary-600 dark:text-secondary-400 mb-1"><strong>To:</strong> {delivery.to}</p>
            <p className="text-secondary-600 dark:text-secondary-400"><strong>Weight:</strong> {delivery.weight} kg</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-secondary-700 dark:text-secondary-300">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <FaClock className="text-warning-500 mr-2" />
                <span className="text-secondary-600 dark:text-secondary-400">Created: {new Date(delivery.createdAt).toLocaleDateString()}</span>
              </div>
              {delivery.status === 'In Transit' && (
                <div className="flex items-center text-sm">
                  <FaTruck className="text-primary-500 mr-2" />
                  <span className="text-secondary-600 dark:text-secondary-400">In Transit: {new Date().toLocaleDateString()}</span>
                </div>
              )}
              {delivery.status === 'Delivered' && (
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-success-500 mr-2" />
                  <span className="text-secondary-600 dark:text-secondary-400">Delivered: {new Date(delivery.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="card">
        <h3 className="text-xl font-display font-semibold mb-4 text-primary-700 dark:text-primary-300">Live Tracking</h3>
        <div className="relative h-96 bg-secondary-100 dark:bg-secondary-800 rounded-xl overflow-hidden">
          {/* Placeholder Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-6xl text-primary-500 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400 text-lg font-medium">Interactive Map</p>
                <p className="text-secondary-500 dark:text-secondary-500 text-sm">Real-time delivery tracking will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Route Visualization Placeholder */}
          <div className="absolute top-4 left-4 bg-white dark:bg-secondary-800 rounded-lg p-3 shadow-soft">
            <div className="flex items-center">
              <FaRoute className="text-primary-500 mr-2" />
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Route: {delivery.from} → {delivery.to}</span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute top-4 right-4 bg-white dark:bg-secondary-800 rounded-lg p-3 shadow-soft">
            <div className="flex items-center">
              {getStatusIcon(delivery.status)}
              <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">{delivery.status}</span>
            </div>
          </div>

          {/* Current Location Marker */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <FaMapMarkerAlt className="text-2xl text-danger-500 animate-bounce-soft" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-secondary-800 rounded-lg px-2 py-1 shadow-soft">
                <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">Current Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Progress */}
      <div className="card">
        <h3 className="text-xl font-display font-semibold mb-4 text-primary-700 dark:text-primary-300">Delivery Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-success-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Package Picked Up</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">{delivery.from}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              delivery.status === 'In Transit' || delivery.status === 'Delivered'
                ? 'bg-success-100 dark:bg-success-900'
                : 'bg-secondary-100 dark:bg-secondary-800'
            }`}>
              {delivery.status === 'In Transit' || delivery.status === 'Delivered' ? (
                <FaCheckCircle className="text-success-500" />
              ) : (
                <FaTruck className="text-secondary-400" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">In Transit</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Package is on the way</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              delivery.status === 'Delivered'
                ? 'bg-success-100 dark:bg-success-900'
                : 'bg-secondary-100 dark:bg-secondary-800'
            }`}>
              {delivery.status === 'Delivered' ? (
                <FaCheckCircle className="text-success-500" />
              ) : (
                <FaBox className="text-secondary-400" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Delivered</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">{delivery.to}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
