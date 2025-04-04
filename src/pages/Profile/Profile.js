import React, { useEffect, useState } from 'react';
import './Profile.css';
import { api } from '../../services/api';

function Profile({ applications }) {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    applied: 0
  });

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  // Update stats whenever applications change
  useEffect(() => {
    if (applications) {
      const newStats = {
        total: applications.length,
        shortlisted: applications.filter(app => app.isShortlisted).length,
        applied: applications.filter(app => app.isApplied).length
      };
      setStats(newStats);
    }
  }, [applications]);

  const getProfile = async () => {
    try {
      const response = await api.getProfile();
      setUserData(response.user_data);

      // Display message to user
      const messageElement = document.createElement('div');
      messageElement.textContent = response.message;
      messageElement.style.cssText = 'position: fixed; top: 50px; right: 45%; padding: 10px; background:rgb(56, 250, 63); color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 1000); // Remove after 10sec

    } catch (error) {
      console.error('Profile fetch erro:', error);
    }
  };

  // Call getProfile when component mounts
  useEffect(() => {
    getProfile();
  }, []); // Empty dependency array means this runs once on mount

  if (!userData) {
    return <div className="main-content">Loading profile...</div>;
  }

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={userData.profile_photo} alt="Profile" />
          </div>
          <h2 className="page-title">My Profile</h2>
        </div>
        
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{userData.username || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{userData.email}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{userData.phone_number || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              <p>{userData.city || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>State</label>
              <p>{userData.state || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Country</label>
              <p>{userData.country || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Pincode</label>
              <p>{userData.pincode || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Application Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.shortlisted}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.applied}</span>
              <span className="stat-label">Applied</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile; 