const Notification = require('../models/Notification');
const User = require('../models/User');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedDelivery')
      .populate('relatedTrip');

    const total = await Notification.countDocuments({ user: userId });
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    res.json({
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new notification
exports.createNotification = async (userId, title, message, type = 'info', relatedDelivery = null, relatedTrip = null, actionUrl = null) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      relatedDelivery,
      relatedTrip,
      actionUrl,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Notification.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
