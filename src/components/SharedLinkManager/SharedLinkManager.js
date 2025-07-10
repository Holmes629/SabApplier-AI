import React, { useState, useEffect } from 'react';
import './SharedLinkManager.css';
import { api } from '../../services/api';

const SharedLinkManager = ({ isOpen, onClose }) => {
  const [shares, setShares] = useState({ sent_shares: [], received_shares: [] });
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('received'); // 'sent' or 'received'

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [sharesResponse, notificationsResponse] = await Promise.all([
        api.getUserShares(),
        api.getUserNotifications()
      ]);
      
      setShares(sharesResponse);
      setNotifications(notificationsResponse.notifications);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSharing = async (receiverEmail) => {
    try {
      await api.stopDataSharing(receiverEmail);
      alert('Data sharing stopped successfully!');
      loadData(); // Refresh data
    } catch (error) {
      alert('Failed to stop sharing: ' + error.message);
    }
  };

  const handleRespondToRequest = async (shareId, action) => {
    try {
      await api.respondToShareRequest(shareId, action);
      alert(`Request ${action}ed successfully!`);
      loadData(); // Refresh data
    } catch (error) {
      alert(`Failed to ${action} request: ` + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'status-pending',
      accepted: 'status-accepted',
      declined: 'status-declined',
      stopped: 'status-stopped'
    };
    
    return (
      <span className={`status-badge ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="shared-link-modal-overlay">
      <div className="shared-link-modal-content">
        <div className="shared-link-modal-header">
          <h2>Manage Data Sharing</h2>
          <button 
            className="shared-link-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="shared-link-modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received Requests ({shares.received_shares.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent Requests ({shares.sent_shares.length})
          </button>
        </div>
        
        <div className="shared-link-modal-body">
          {isLoading ? (
            <div className="loading-state">Loading...</div>
          ) : (
            <>
              {activeTab === 'received' && (
                <div className="shares-section">
                  <h3>Data Sharing Requests Received</h3>
                  {shares.received_shares.length === 0 ? (
                    <p className="no-data">No sharing requests received yet.</p>
                  ) : (
                    <div className="shares-list">
                      {shares.received_shares.map((share) => (
                        <div key={share.id} className="share-item">
                          <div className="share-info">
                            <strong>{share.sender_email}</strong> wants to share their data with you
                            <div className="share-meta">
                              Requested on: {formatDate(share.shared_at)}
                              {getStatusBadge(share.status)}
                            </div>
                          </div>
                          <div className="share-actions">
                            {share.status === 'pending' && (
                              <>
                                <button 
                                  className="btn-accept"
                                  onClick={() => handleRespondToRequest(share.id, 'accept')}
                                >
                                  Accept
                                </button>
                                <button 
                                  className="btn-decline"
                                  onClick={() => handleRespondToRequest(share.id, 'decline')}
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {share.status === 'accepted' && share.is_active && (
                              <span className="active-label">✓ Active</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sent' && (
                <div className="shares-section">
                  <h3>Data Sharing Requests Sent</h3>
                  {shares.sent_shares.length === 0 ? (
                    <p className="no-data">No sharing requests sent yet.</p>
                  ) : (
                    <div className="shares-list">
                      {shares.sent_shares.map((share) => (
                        <div key={share.id} className="share-item">
                          <div className="share-info">
                            <strong>{share.receiver_email}</strong>
                            <div className="share-meta">
                              Shared on: {formatDate(share.shared_at)}
                              {getStatusBadge(share.status)}
                            </div>
                          </div>
                          <div className="share-actions">
                            {share.status === 'accepted' && share.is_active && (
                              <button 
                                className="btn-stop"
                                onClick={() => handleStopSharing(share.receiver_email)}
                              >
                                Stop Sharing
                              </button>
                            )}
                            {share.status === 'pending' && (
                              <span className="pending-label">⏳ Pending Response</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Section */}
              <div className="notifications-section">
                <h3>Recent Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="no-data">No notifications yet.</p>
                ) : (
                  <div className="notifications-list">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="notification-item">
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {formatDate(notification.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="shared-link-modal-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedLinkManager;