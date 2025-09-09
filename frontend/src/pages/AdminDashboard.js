import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [trips, setTrips] = useState([]);
  // Add a check to ensure trips is always an array
  const [fraudReports, setFraudReports] = useState([]);
  const [agents, setAgents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [salesReport, setSalesReport] = useState({});
  const [deliveryMetrics, setDeliveryMetrics] = useState({});
  const [customerInsights, setCustomerInsights] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Sender' });
  const [notification, setNotification] = useState({ userId: '', message: '', type: 'info' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const [usersRes, deliveriesRes, tripsRes, fraudRes, agentsRes, transactionsRes, salesRes, metricsRes, insightsRes, alertsRes, settingsRes] = await Promise.all([
        fetch('http://localhost:5003/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/deliveries', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/trips', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/fraud-reports', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/agents', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/reports/sales', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/reports/delivery-metrics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/reports/customer-insights', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/alerts', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5003/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [usersData, deliveriesData, tripsData, fraudData, agentsData, transactionsData, salesData, metricsData, insightsData, alertsData, settingsData] = await Promise.all([
        usersRes.json(), deliveriesRes.json(), tripsRes.json(), fraudRes.json(), agentsRes.json(), transactionsRes.json(), salesRes.json(), metricsRes.json(), insightsRes.json(), alertsRes.json(), settingsRes.json()
      ]);

      setUsers(usersData);
      setDeliveries(deliveriesData);
      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setFraudReports(fraudData);
      setAgents(agentsData);
      setTransactions(transactionsData);
      setSalesReport(salesData);
      setDeliveryMetrics(metricsData);
      setCustomerInsights(insightsData);
      setSystemAlerts(alertsData);
      setSystemSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await fetch(`http://localhost:5003/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOverviewData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5003/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setNewUser({ name: '', email: '', password: '', role: 'Sender' });
        fetchOverviewData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5003/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notification),
      });
      setNotification({ userId: '', message: '', type: 'info' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5003/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOverviewData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateFraudStatus = async (reportId, status) => {
    try {
      await fetch(`http://localhost:5003/api/admin/fraud-reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOverviewData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading admin dashboard...</p>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'User Management' },
    { id: 'orders', label: 'Order Management' },
    { id: 'agents', label: 'Delivery Agents' },
    { id: 'payments', label: 'Payments' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome Admin!</h1>
        <p className="text-lg opacity-90">Manage your delivery platform efficiently with comprehensive admin tools.</p>
        <div className="mt-4 flex gap-4">
          <div className="bg-white/20 p-3 rounded">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm">Total Users</div>
          </div>
          <div className="bg-white/20 p-3 rounded">
            <div className="text-2xl font-bold">{deliveries.length}</div>
            <div className="text-sm">Active Deliveries</div>
          </div>
          <div className="bg-white/20 p-3 rounded">
            <div className="text-2xl font-bold">{trips.filter(trip => trip.status === 'Active').length}</div>
            <div className="text-sm">Active Trips</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">Total Deliveries</h3>
              <p className="text-2xl font-bold">{deliveries.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">Active Trips</h3>
              <p className="text-2xl font-bold">{trips.filter(trip => trip.status === 'Active').length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">Fraud Reports</h3>
              <p className="text-2xl font-bold">{fraudReports.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Recent Users</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">{user.isBanned ? 'Banned' : 'Active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Recent Deliveries</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.slice(0, 5).map((delivery) => (
                    <tr key={delivery._id} className="border-b">
                      <td className="p-2">{delivery.title}</td>
                      <td className="p-2">{delivery.status}</td>
                      <td className="p-2">{new Date(delivery.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="Sender">Sender</option>
                <option value="Traveler">Traveler</option>
                <option value="Admin">Admin</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                Create User
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.isBanned ? 'Banned' : 'Active'}</td>
                    <td className="p-2">
                      {!user.isBanned && (
                        <button
                          onClick={() => handleBanUser(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Order Management</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery._id} className="border-b">
                  <td className="p-2">{delivery.title}</td>
                  <td className="p-2">{delivery.user?.name || 'N/A'}</td>
                  <td className="p-2">{delivery.status}</td>
                  <td className="p-2">{new Date(delivery.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <select
                      value={delivery.status}
                      onChange={(e) => handleUpdateOrderStatus(delivery._id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Delivery Agents</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Verified</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent._id} className="border-b">
                  <td className="p-2">{agent.name}</td>
                  <td className="p-2">{agent.email}</td>
                  <td className="p-2">{agent.isVerified ? 'Yes' : 'No'}</td>
                  <td className="p-2">{agent.isBanned ? 'Banned' : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Payment Transactions</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{transaction.user?.name || 'N/A'}</td>
                  <td className="p-2">{transaction.type}</td>
                  <td className="p-2">${transaction.amount}</td>
                  <td className="p-2">{transaction.description}</td>
                  <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Sales Report</h2>
            <p>Total Revenue: ${salesReport.totalRevenue || 0}</p>
            <p>Total Orders: {salesReport.totalOrders || 0}</p>
            <p>Completed Orders: {salesReport.completedOrders || 0}</p>
            <p>Completion Rate: {salesReport.completionRate || 0}%</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Delivery Metrics</h2>
            <p>Total Deliveries: {deliveryMetrics.totalDeliveries || 0}</p>
            <p>On-Time Delivery Rate: {deliveryMetrics.onTimeDeliveryRate || 0}%</p>
            <p>Average Delivery Time: {deliveryMetrics.averageDeliveryTime || 0} hours</p>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Send Notification</h2>
            <form onSubmit={handleSendNotification} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="User ID"
                value={notification.userId}
                onChange={(e) => setNotification({ ...notification, userId: e.target.value })}
                className="p-2 border rounded"
              />
              <select
                value={notification.type}
                onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <textarea
                placeholder="Message"
                value={notification.message}
                onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                className="p-2 border rounded col-span-2"
                rows="3"
                required
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                Send Notification
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">System Alerts</h2>
            <ul>
              {systemAlerts.map((alert, index) => (
                <li key={index} className="p-2 border-b">
                  <strong>{alert.severity.toUpperCase()}:</strong> {alert.message}
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">System Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Zones</label>
              <p className="p-2 bg-gray-100 rounded">{systemSettings.deliveryZones?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base Delivery Charge</label>
              <p className="p-2 bg-gray-100 rounded">${systemSettings.baseDeliveryCharge || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Percentage</label>
              <p className="p-2 bg-gray-100 rounded">{systemSettings.discountPercentage || 0}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">App Version</label>
              <p className="p-2 bg-gray-100 rounded">{systemSettings.appVersion || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default AdminDashboard;

