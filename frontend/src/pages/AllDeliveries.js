import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const AllDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, searchTerm, statusFilter]);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/delivery', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch deliveries');
      }
      const data = await response.json();
      setDeliveries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    let filtered = deliveries;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.to.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    setFilteredDeliveries(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5003/api/delivery/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete delivery');
      }

      setDeliveries(deliveries.filter(delivery => delivery._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      case 'In Transit':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  // Calculate stats
  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'Posted' || d.status === 'Requested').length,
    processing: deliveries.filter(d => d.status === 'Approved' || d.status === 'Picked Up' || d.status === 'In Transit').length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length,
    cancelled: deliveries.filter(d => d.status === 'Cancelled').length,
  };

  // Check for warnings
  const overdueDeliveries = deliveries.filter(d => new Date(d.deadline) < new Date() && d.status !== 'Delivered');
  const showWarning = overdueDeliveries.length > 0;

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">All Delivery Requests</h1>
            </div>
            <button
              onClick={() => navigate('/new-delivery')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              + New Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900">Total</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900">Processing</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.processing}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900">Delivered</h3>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-900">Cancelled</h3>
            <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Warning */}
        {showWarning && (
          <div className="bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Overdue Deliveries Warning
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>You have {overdueDeliveries.length} delivery request(s) past their deadline. Please review and update their status.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, from, or to location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Posted">Posted</option>
                <option value="Requested">Requested</option>
                <option value="Approved">Approved</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading deliveries...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : paginatedDeliveries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No delivery requests found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedDeliveries.map((delivery) => (
                      <tr key={delivery._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{delivery.title}</div>
                          <div className="text-sm text-gray-500">{delivery.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{delivery.from} {delivery.fromAddress ? `- ${delivery.fromAddress}` : ''}</div>
                          <div className="text-sm text-gray-500">→ {delivery.to} {delivery.toAddress ? `- ${delivery.toAddress}` : ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {delivery.weight} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${delivery.cost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(delivery.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(delivery._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(startIndex + itemsPerPage, filteredDeliveries.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredDeliveries.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDeliveries;
