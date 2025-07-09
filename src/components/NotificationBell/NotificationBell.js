import React, { useState, useEffect, useRef } from 'react';
import './NotificationBell.css';
import { api } from '../../services/api';
import { Bell, X, CheckCheck, Share2, Check, XCircle, StopCircle, Mail } from 'lucide-react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserNotifications();
      const sortedNotifications = response.notifications.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      
      // Ensure each notification has is_read property (default to false if not present)
      const notificationsWithReadStatus = sortedNotifications.map(notification => ({
        ...notification,
        is_read: notification.is_read || false
      }));
      
      setNotifications(notificationsWithReadStatus);
      setUnreadCount(notificationsWithReadStatus.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    // For now, mark as read locally since backend doesn't support it yet
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    // For now, mark all as read locally since backend doesn't support it yet
    const unreadCount = notifications.filter(n => !n.is_read).length;
    if (unreadCount === 0) return;
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationItemClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
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
        return <Share2 className="w-4 h-4 text-blue-600" />;
      case 'share_accepted':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'share_declined':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'share_stopped':
        return <StopCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="notification-bell-container">
      <button
        ref={buttonRef}
        className="notification-bell-button"
        onClick={handleNotificationClick}
        aria-label="Notifications"
      >
        <Bell className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-bell-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div ref={dropdownRef} className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  className="notification-mark-all-read"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Mark all read
                </button>
              )}
              <button
                className="notification-close-btn"
                onClick={() => setShowDropdown(false)}
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="notification-dropdown-body">
            {isLoading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                    onClick={() => handleNotificationItemClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        {!notification.is_read && (
                          <span className="notification-unread-dot"></span>
                        )}
                      </div>
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
