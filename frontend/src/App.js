import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewDelivery from './pages/NewDelivery';
import AllDeliveries from './pages/AllDeliveries';
import PostTrip from './pages/PostTrip';
import Reviews from './pages/Reviews';
import Wallet from './pages/Wallet';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryHistory from './pages/DeliveryHistory';
import Messages from './pages/Messages';
import FraudReports from './pages/FraudReports';
import DeliveryTrackingPage from './pages/DeliveryTrackingPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Support from './pages/Support';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-delivery" element={<NewDelivery />} />
            <Route path="/deliveries" element={<AllDeliveries />} />
            <Route path="/post-trip" element={<PostTrip />} />
            <Route path="/reviews/:userId" element={<Reviews />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/history" element={<DeliveryHistory />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/admin/fraud-reports" element={<FraudReports />} />
            <Route path="/delivery-tracking/:id?" element={<DeliveryTrackingPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
