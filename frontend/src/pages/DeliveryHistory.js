import React, { useEffect, useState } from 'react';

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [deliveriesRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:5003/api/delivery/history', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5003/api/delivery/analytics', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!deliveriesRes.ok) {
          throw new Error(`Failed to fetch delivery history: ${deliveriesRes.status}`);
        }
        if (!analyticsRes.ok) {
          throw new Error(`Failed to fetch analytics: ${analyticsRes.status}`);
        }

        const deliveriesData = await deliveriesRes.json();
        const analyticsData = await analyticsRes.json();

        // Ensure data is in expected format
        setDeliveries(Array.isArray(deliveriesData) ? deliveriesData : []);
        setAnalytics(typeof analyticsData === 'object' && analyticsData !== null ? analyticsData : {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading delivery history...</p>;
  }

  // Additional stats for UI enhancement
  const pendingCount = deliveries.filter(d => d.status === 'Posted' || d.status === 'Requested').length;
  const processingCount = deliveries.filter(d => d.status === 'Approved' || d.status === 'Picked Up' || d.status === 'In Transit').length;
  const cancellationCount = deliveries.filter(d => d.status === 'Cancelled').length;
  const showWarning = deliveries.some(d => new Date(d.deadline) < new Date() && d.status !== 'Delivered');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Delivery History & Analytics</h1>

      {/* Enhanced Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Deliveries</h3>
          <p className="text-2xl font-bold">{analytics.totalDeliveries || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{analytics.completedDeliveries || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-2xl font-bold text-green-600">${analytics.totalEarnings || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Average Rating</h3>
          <p className="text-2xl font-bold">{analytics.averageRating || 0}/5</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow border border-yellow-300">
          <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
          <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded shadow border border-purple-300">
          <h3 className="text-lg font-semibold text-purple-800">Processing</h3>
          <p className="text-2xl font-bold text-purple-700">{processingCount}</p>
        </div>
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="bg-red-100 border border-red-300 rounded p-4 mb-6 shadow">
          <h3 className="text-red-800 font-semibold mb-2">Overdue Deliveries Warning</h3>
          <p className="text-red-700">You have delivery request(s) past their deadline. Please review and update their status.</p>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Delivery History</h2>
        {deliveries.length === 0 ? (
          <p>No delivery history yet.</p>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="border p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{delivery.title}</h3>
                    <p className="text-gray-600">{delivery.from} → {delivery.to}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(delivery.createdAt).toLocaleDateString()} • {delivery.weight} kg • ${delivery.cost}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      delivery.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {delivery.status}
                    </span>
                    {delivery.rating && (
                      <p className="text-sm mt-1">Rating: {delivery.rating}/5</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
