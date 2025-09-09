import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaBoxOpen, FaClock, FaPlane, FaMapMarkerAlt, FaPlus, FaWallet, FaExclamationTriangle, FaStar, FaCog, FaBell, FaSearch, FaUser, FaSignOutAlt, FaRoute, FaChartBar, FaQuestionCircle } from 'react-icons/fa';
import AISmartMatch from '../components/AISmartMatch';
import Notifications from '../components/Notifications';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [travelerTrips, setTravelerTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sidebarItems = [
    { label: 'Dashboard', icon: FaChartBar, onClick: () => navigate('/dashboard') },
    { label: 'New Delivery', icon: FaPlus, onClick: () => navigate('/new-delivery') },
    { label: 'All Deliveries', icon: FaBox, onClick: () => navigate('/deliveries') },
    { label: 'Post Trip', icon: FaPlane, onClick: () => navigate('/post-trip') },
    { label: 'Delivery History', icon: FaClock, onClick: () => navigate('/history') },
    { label: 'Delivery Tracking', icon: FaMapMarkerAlt, onClick: () => navigate('/delivery-tracking') },
    { label: 'Wallet', icon: FaWallet, onClick: () => navigate('/wallet') },
    { label: 'Reviews', icon: FaStar, onClick: () => navigate('/reviews') },
    { label: 'Messages', icon: FaBell, onClick: () => navigate('/messages') },
    { label: 'Admin Dashboard', icon: FaCog, onClick: () => navigate('/admin') },
    { label: 'Fraud Reports', icon: FaExclamationTriangle, onClick: () => navigate('/admin/fraud-reports') },
    { label: 'Analytics', icon: FaChartBar, onClick: () => navigate('/analytics') },
    { label: 'Settings', icon: FaCog, onClick: () => navigate('/settings') },
    { label: 'Support', icon: FaQuestionCircle, onClick: () => navigate('/support') },
  ];

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchDeliveryRequests();
    if (JSON.parse(storedUser).role === 'Traveler') {
      fetchTravelerTrips();
    }
  }, []);

  const fetchDeliveryRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/delivery', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch delivery requests');
      }
      const data = await response.json();
      setDeliveryRequests(data);
    } catch (error) {
      console.error(error);
      setDeliveryRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTravelerTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/traveler', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch traveler trips');
      }
      const data = await response.json();
      setTravelerTrips(data);
    } catch (error) {
      console.error(error);
    }
  };

  const countByStatus = (status) => {
    return deliveryRequests.filter((req) => req.status === status).length;
  };

  const totalRequests = deliveryRequests.length;
  const inTransit = countByStatus('In Transit');
  const delivered = countByStatus('Delivered');
  const pending = countByStatus('Pending');

  const isTraveler = user && user.role === 'Traveler';
  const isSender = user && user.role === 'Sender';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-primary-700 dark:text-primary-300">EasyDelivery</h2>
        <nav>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.label} className="mb-4">
                <button
                  onClick={item.onClick}
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        <AISmartMatch userId={user?.id} token={localStorage.getItem('token')} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'User'}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Here's an overview of your delivery activities.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <FaBox className="w-8 h-8 text-blue-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalRequests}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <FaClock className="w-8 h-8 text-yellow-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <FaTruck className="w-8 h-8 text-green-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Transit</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{inTransit}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <FaBoxOpen className="w-8 h-8 text-purple-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{delivered}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Traveler Trips Section */}
            {isTraveler && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Posted Trips</h3>
                {travelerTrips.length > 0 ? (
                  <div className="space-y-4">
                    {travelerTrips.slice(0, 3).map((trip) => (
                      <div key={trip._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center">
                          <FaPlane className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {trip.origin} → {trip.destination}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(trip.departureDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                          trip.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No trips posted yet.</p>
                )}
              </div>
            )}

            {/* Recent Deliveries */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Deliveries</h3>
              {deliveryRequests.length > 0 ? (
                <div className="space-y-4">
                  {deliveryRequests.slice(0, 5).map((request) => (
                    <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <FaBox className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {request.itemDescription}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.origin} → {request.destination}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                        request.status === 'In Transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200' :
                        request.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No delivery requests yet.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
