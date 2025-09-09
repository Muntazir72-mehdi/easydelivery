import React, { useEffect, useState } from 'react';

const FraudReports = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    deliveryId: '',
    customerId: '',
  });

  useEffect(() => {
    // Fetch existing fraud reports (dummy data for now)
    setReports([
      { id: 1, title: 'Fake delivery', description: 'Package never arrived', status: 'Pending' },
      { id: 2, title: 'Scam traveler', description: 'Traveler did not deliver', status: 'Resolved' },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!newReport.title.trim() || !newReport.description.trim()) {
      alert('Please fill in all fields');
      return;
    }
    const report = {
      id: reports.length + 1,
      title: newReport.title.trim(),
      description: newReport.description.trim(),
      deliveryId: newReport.deliveryId.trim(),
      customerId: newReport.customerId.trim(),
      status: 'Pending',
    };
    setReports([report, ...reports]);
    setNewReport({ title: '', description: '', deliveryId: '', customerId: '' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fraud Reports</h1>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Report Title"
          value={newReport.title}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <textarea
          name="description"
          rows="4"
          placeholder="Describe the fraud incident..."
          value={newReport.description}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="deliveryId"
          placeholder="Delivery ID (optional)"
          value={newReport.deliveryId}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="customerId"
          placeholder="Customer ID (optional)"
          value={newReport.customerId}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Submit Report
        </button>
      </div>
      {reports.length === 0 ? (
        <p>No fraud reports yet.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{report.title}</h3>
              <p>{report.description}</p>
              <p>Status: <span className={report.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}>{report.status}</span></p>
              {report.deliveryId && <p className="text-sm text-gray-500">Delivery ID: {report.deliveryId}</p>}
              {report.customerId && <p className="text-sm text-gray-500">Customer ID: {report.customerId}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FraudReports;
