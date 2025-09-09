const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// User Management Routes
router.get('/users', authMiddleware, roleMiddleware(['Admin']), adminController.getAllUsers);
router.post('/users', authMiddleware, roleMiddleware(['Admin']), adminController.createUser);
router.put('/users/:id', authMiddleware, roleMiddleware(['Admin']), adminController.updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['Admin']), adminController.deleteUser);
router.put('/users/:id/ban', authMiddleware, roleMiddleware(['Admin']), adminController.toggleBanUser);
router.put('/users/:id/role', authMiddleware, roleMiddleware(['Admin']), adminController.assignRole);

// Order Management Routes
router.get('/orders', authMiddleware, roleMiddleware(['Admin']), adminController.getOrdersByStatus);
router.put('/orders/:id/assign', authMiddleware, roleMiddleware(['Admin']), adminController.assignOrder);
router.put('/orders/:id/status', authMiddleware, roleMiddleware(['Admin']), adminController.updateOrderStatus);

// Delivery Agent Management Routes
router.get('/agents', authMiddleware, roleMiddleware(['Admin']), adminController.getAllAgents);
router.put('/agents/:id/verify', authMiddleware, roleMiddleware(['Admin']), adminController.verifyAgent);
router.get('/agents/:id/performance', authMiddleware, roleMiddleware(['Admin']), adminController.getAgentPerformance);

// Payment & Transactions Routes
router.get('/transactions', authMiddleware, roleMiddleware(['Admin']), adminController.getAllTransactions);
router.post('/refunds', authMiddleware, roleMiddleware(['Admin']), adminController.processRefund);

// Analytics & Reports Routes
router.get('/reports/sales', authMiddleware, roleMiddleware(['Admin']), adminController.getSalesReport);
router.get('/reports/delivery-metrics', authMiddleware, roleMiddleware(['Admin']), adminController.getDeliveryMetrics);
router.get('/reports/customer-insights', authMiddleware, roleMiddleware(['Admin']), adminController.getCustomerInsights);

// Notifications & Alerts Routes
router.post('/notifications', authMiddleware, roleMiddleware(['Admin']), adminController.sendNotification);
router.get('/alerts', authMiddleware, roleMiddleware(['Admin']), adminController.getSystemAlerts);

// System Settings Routes
router.get('/settings', authMiddleware, roleMiddleware(['Admin']), adminController.getSystemSettings);
router.put('/settings', authMiddleware, roleMiddleware(['Admin']), adminController.updateSystemSettings);

// Legacy routes (keeping for backward compatibility)
router.get('/deliveries', authMiddleware, roleMiddleware(['Admin']), adminController.getAllDeliveries);
router.get('/trips', authMiddleware, roleMiddleware(['Admin']), adminController.getAllTrips);
router.get('/fraud-reports', authMiddleware, roleMiddleware(['Admin']), adminController.getAllFraudReports);
router.put('/fraud-reports/:id/status', authMiddleware, roleMiddleware(['Admin']), adminController.updateFraudReportStatus);

module.exports = router;
