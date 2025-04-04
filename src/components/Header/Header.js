import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ cartCount, onLogout }) {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMobileMenuClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    onLogout();
    setShowProfileMenu(false);
    setShowMobileMenu(false);
  };

  const closeMenus = () => {
    setShowProfileMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-section">
          <div className="logo">
            <img src="logo.jpeg" alt="SabApplier AI" />
          </div>
          <h2>SabApplier AI</h2>
        </Link>
        <nav className="nav-tabs">
          <Link 
            to="/" 
            className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`nav-tab ${location.pathname === '/cart' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
          <Link 
            to="/track" 
            className={`nav-tab ${location.pathname === '/track' ? 'active' : ''}`}
            onClick={closeMenus}
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
              <Link to="/profile" className="profile-menu-item" onClick={closeMenus}>
                My Profile
              </Link>
              <button onClick={handleLogout} className="profile-menu-item logout">
                Sign Out
              </button>
            </div>
          )}
        </div>
        <button className="mobile-menu-button" onClick={handleMobileMenuClick}>
          <span className={`hamburger ${showMobileMenu ? 'active' : ''}`}></span>
        </button>
      </div>
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className={`mobile-menu-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`mobile-menu-item ${location.pathname === '/cart' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
          <Link 
            to="/track" 
            className={`mobile-menu-item ${location.pathname === '/track' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Track My Applications
          </Link>
          <Link 
            to="/profile" 
            className={`mobile-menu-item ${location.pathname === '/profile' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            My Profile
          </Link>
          <button onClick={handleLogout} className="mobile-menu-item logout">
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header; 