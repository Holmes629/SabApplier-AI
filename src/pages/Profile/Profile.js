import React, { useEffect, useState } from 'react';
import './Profile.css';

function Profile({ applications }) {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    applied: 0
  });

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('currentUser');
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

  if (!userData) {
    return <div className="main-content">Loading profile...</div>;
  }

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder"></div>
          </div>
          <h2 className="page-title">My Profile</h2>
        </div>
        
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{userData.name || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{userData.email}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{userData.phone || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              <p>{userData.location || 'Not provided'}</p>
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