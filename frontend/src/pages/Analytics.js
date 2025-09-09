import React, { useEffect, useState } from 'react';
import { FaChartBar, FaBox, FaCheckCircle, FaDollarSign, FaStar } from 'react-icons/fa';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5003/api/delivery/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <FaChartBar className="mr-3 text-blue-500" />
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBox className="text-blue-500 mr-3 text-2xl" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalDeliveries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-3 text-2xl" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completedDeliveries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-yellow-500 mr-3 text-2xl" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.totalEarnings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaStar className="text-purple-500 mr-3 text-2xl" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.averageRating || 0}/5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h2>
          <div className="text-center py-12">
            <FaChartBar className="text-gray-400 mx-auto text-6xl mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Detailed charts and graphs will be implemented here in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
