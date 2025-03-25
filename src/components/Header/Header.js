import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ shortlistedCount, onLogout }) {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    onLogout();
    setShowProfileMenu(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-section">
          <div className="logo">
            <img src="logo.png" alt="SabApplier AI" />
          </div>
          <h2>SabApplier AI</h2>
        </Link>
        <nav className="nav-tabs">
          <Link 
            to="/" 
            className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/shortlisted" 
            className={`nav-tab ${location.pathname === '/shortlisted' ? 'active' : ''}`}
          >
            Shortlisted Applications
            {shortlistedCount > 0 && (
              <span className="shortlist-count">{shortlistedCount}</span>
            )}
          </Link>
          <Link 
            to="/track" 
            className={`nav-tab ${location.pathname === '/track' ? 'active' : ''}`}
          >
            Track My Applications
          </Link>
        </nav>
        <div className="header-profile-section">
          <button 
            className={`profile-button ${showProfileMenu ? 'active' : ''}`}
            onClick={handleProfileClick}
          >
            <div className="profile-icon"></div>
          </button>
          {showProfileMenu && (
            <div className="profile-menu">
              <Link to="/profile" className="profile-menu-item">
                My Profile
              </Link>
              <button onClick={handleLogout} className="profile-menu-item logout">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header; 