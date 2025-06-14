import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-gray-800 no-underline hover:text-blue-600 transition-colors">
          <div className="w-10 h-10 mr-3">
            <img src={logo} alt="SabApplier AI" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-semibold m-0">SabApplier AI</h2>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              location.pathname === '/' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 relative ${
              location.pathname === '/cart' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link 
            to="/docs" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              location.pathname === '/docs' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            My Documents
          </Link>
          <Link 
            to="/auto-fill-data" 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              location.pathname === '/auto-fill-data' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            Auto Fill Data
          </Link>
        </nav>
        <div className="relative" ref={profileRef}>
          <button 
            className={`p-2 rounded-lg transition-all duration-200 ${
              showProfileMenu ? 'bg-blue-50' : 'hover:bg-gray-100'
            }`}
            onClick={handleProfileClick}>
            <div className="w-10 h-10 rounded-full bg-blue-600"></div>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={closeMenus}>
                My Details
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                Sign Out
              </button>
            </div>
          )}
        </div>
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleMobileMenuClick}>
          <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-200 ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-600 mt-1 transition-all duration-200 ${showMobileMenu ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-600 mt-1 transition-all duration-200 ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>
      </div>
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
          <Link 
            to="/" 
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname === '/' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            Home
          </Link>
          <Link 
            to="/cart" 
            className={`block px-4 py-3 rounded-lg font-medium transition-colors relative ${
              location.pathname === '/cart' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            Cart
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link 
            to="/docs" 
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname === '/docs' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            My Documents
          </Link>
          <Link 
            to="/auto-fill-data" 
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname === '/auto-fill-data' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            Auto Fill Data
          </Link>
          <Link 
            to="/profile" 
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname === '/profile' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={closeMenus}>
            My Details
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors">
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
