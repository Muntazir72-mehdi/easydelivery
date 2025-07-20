import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaBoxOpen, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchDeliveryRequests();
  }, []);

  const fetchDeliveryRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/delivery', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch delivery requests');
      }
      const data = await response.json();
      setDeliveryRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const countByStatus = (status) => {
    return deliveryRequests.filter((req) => req.status === status).length;
  };

  const totalRequests = deliveryRequests.length;
  const inTransit = countByStatus('In Transit');
  const delivered = countByStatus('Delivered');
  const pending = countByStatus('Pending');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-blue-700 text-white rounded-lg p-6 mb-6 flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user ? user.name : 'User'}!
          </h1>
          <p>Ready to send or track your deliveries?</p>
        </div>
        <button
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => navigate('/new-delivery')}
        >
          + New Delivery Request
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="ml-4 p-2 rounded text-black"
          // Implement search functionality as needed
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow">
          <FaBoxOpen className="text-blue-500 text-3xl" />
          <div>
            <p className="font-semibold">Total Requests</p>
            <p className="text-xl">{totalRequests}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow">
          <FaTruck className="text-yellow-600 text-3xl" />
          <div>
            <p className="font-semibold">In Transit</p>
            <p className="text-xl">{inTransit}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow">
          <FaBox className="text-green-600 text-3xl" />
          <div>
            <p className="font-semibold">Delivered</p>
            <p className="text-xl">{delivered}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow">
          <FaClock className="text-orange-500 text-3xl" />
          <div>
            <p className="font-semibold">Pending</p>
            <p className="text-xl">{pending}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Recent Delivery Requests</h2>
          <button
            className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
            onClick={() => navigate('/deliveries')}
          >
            View All
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : deliveryRequests.length === 0 ? (
          <p>No delivery requests found.</p>
        ) : (
          deliveryRequests.slice(0, 3).map((req) => (
            <div
              key={req._id}
              className="border border-gray-200 rounded p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{req.title}</p>
                <p className="text-sm text-gray-600">
                  {req.from} → {req.to}
                </p>
                <p className="text-xs text-gray-500">
                  Deadline: {new Date(req.deadline).toLocaleDateString()} • {req.weight} kg • ${req.cost}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    req.status === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : req.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
