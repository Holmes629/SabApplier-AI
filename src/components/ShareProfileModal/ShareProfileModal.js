import React, { useState } from 'react';
import './ShareProfileModal.css';
import { api } from '../../services/api';

const ShareProfileModal = ({ isOpen, onClose, onShare }) => {
  const [friendEmail, setFriendEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    
    if (!friendEmail.trim()) {
      setError('Please enter your friend\'s email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(friendEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await api.shareDataWithFriend(friendEmail.trim().toLowerCase());
      
      // Call parent callback
      if (onShare) {
        onShare(friendEmail);
      }
      
      // Reset form and close modal
      setFriendEmail('');
      onClose();
      
      alert('Data sharing request sent successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFriendEmail('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-content">
        <div className="share-modal-header">
          <h2>Share Your Profile Data</h2>
          <button 
            className="share-modal-close"
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>
        
        <div className="share-modal-body">
          <p>Enter your friend's email address to share your profile data with them.</p>
          
          <form onSubmit={handleShare}>
            <div className="input-group">
              <label htmlFor="friendEmail">Friend's Email Address</label>
              <input
                type="email"
                id="friendEmail"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="Enter your friend's email"
                disabled={isLoading}
                required
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="share-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareProfileModal;