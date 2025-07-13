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
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read);
    if (unreadNotifications.length === 0) return;
    try {
      await Promise.all(unreadNotifications.map(n => api.markNotificationAsRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
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
                {notifications.filter(n => !n.is_read).length === 0 ? (
                  <div className="notification-empty" style={{ padding: '16px 0', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.filter(n => !n.is_read).slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item unread`}
                      onClick={() => handleNotificationItemClick(notification)}
                      style={{ padding: '6px 8px', fontSize: '12px', minHeight: '28px', marginBottom: '2px' }}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message" style={{ fontSize: '12px', margin: 0, lineHeight: '1.3' }}>
                          {notification.message}
                        </p>
                        <div className="notification-meta" style={{ fontSize: '11px', marginTop: '2px' }}>
                          <span className="notification-time">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                          <span className="notification-unread-dot"></span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
