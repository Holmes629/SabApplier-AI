import React, { useState, useEffect } from 'react';
import './NotificationBell.css';
import { api } from '../../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserNotifications();
      const sortedNotifications = response.notifications.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'share_request':
        return '📤';
      case 'share_accepted':
        return '✅';
      case 'share_declined':
        return '❌';
      case 'share_stopped':
        return '⏹️';
      default:
        return '📧';
    }
  };

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell-button"
        onClick={handleNotificationClick}
        aria-label="Notifications"
      >
        <svg
          className="notification-bell-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-bell-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <button
              className="notification-close-btn"
              onClick={() => setShowDropdown(false)}
            >
              ×
            </button>
          </div>
          
          <div className="notification-dropdown-body">
            {isLoading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span>🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 10 && (
            <div className="notification-dropdown-footer">
              <button className="notification-see-all">
                See all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
