import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../../logo.jpeg';

function Header({ cartCount, onLogout }) {
  const location = useLocation();
  const profileRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideProfile = profileRef.current && !profileRef.current.contains(event.target);

      if (
        (showProfileMenu && clickedOutsideProfile) 
      ) {
        closeMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showMobileMenu]);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-section">
          <div className="logo">
            <img src={logo} alt="SabApplier AI" />
          </div>
          <h2>SabApplier AI</h2>
        </Link>
        <nav className="nav-tabs">
          <Link 
            to="/" 
            className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenus}>
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`nav-tab ${location.pathname === '/cart' ? 'active' : ''}`}
            onClick={closeMenus}>
            Cart
            {cartCount > 0 && (<span className="cart-count">{cartCount}</span>)}
          </Link>
          <Link 
            to="/docs" 
            className={`nav-tab ${location.pathname === '/docs' ? 'active' : ''}`}
            onClick={closeMenus}>
            My Documents
          </Link>
          <Link 
            to="/auto-fill-data" 
            className={`nav-tab ${location.pathname === '/auto-fill-data' ? 'active' : ''}`}
            onClick={closeMenus}>
            Auto Fill Data
          </Link>
        </nav>
        <div className="header-profile-section" ref={profileRef}>
          <button 
            className={`profile-button ${showProfileMenu ? 'active' : ''}`}
            onClick={handleProfileClick}>
            <div className="profile-icon"></div>
          </button>
          {showProfileMenu && (
            <div className="profile-menu">
              <Link to="/profile" className="profile-menu-item" onClick={closeMenus}>
                My Details
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
            onClick={closeMenus}>
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`mobile-menu-item ${location.pathname === '/cart' ? 'active' : ''}`}
            onClick={closeMenus}>
            Cart
            {cartCount > 0 && (<span className="cart-count">{cartCount}</span>)}
          </Link>
          <Link 
            to="/docs" 
            className={`mobile-menu-item ${location.pathname === '/docs' ? 'active' : ''}`}
            onClick={closeMenus}>
            My Documents
          </Link>
          <Link 
            to="/auto-fill-data" 
            className={`mobile-menu-item ${location.pathname === '/auto-fill-data' ? 'active' : ''}`}
            onClick={closeMenus}>
            Auto Fill Data
          </Link>
          <Link 
            to="/profile" 
            className={`mobile-menu-item ${location.pathname === '/profile' ? 'active' : ''}`}
            onClick={closeMenus}>
            My Details
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
