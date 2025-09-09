import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchNotifications = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/notifications?page=${pageNumber}&limit=${limit}`);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      fetchNotifications(page);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      fetchNotifications(page);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="notifications-container p-4 bg-white rounded shadow max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications ({unreadCount} unread)</h2>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline"
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-3 rounded border ${
                notification.isRead ? 'bg-gray-100' : 'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm">{notification.message}</p>
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </a>
                  )}
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="ml-4 text-sm text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
