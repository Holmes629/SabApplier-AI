import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import logo from '../../logo.jpeg';
import { api } from '../../services/api';

const Navbar = ({ 
  isAuthenticated = false, 
  cartCount = 0, 
  onLogout,
  currentUser 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [googleProfileData, setGoogleProfileData] = useState(null);
  const location = useLocation();
  const profileRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  // Fetch user profile data when authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && currentUser) {
        try {
          // Check for Google profile data from localStorage
          const googleData = localStorage.getItem("googleData");
          if (googleData) {
            try {
              const parsedGoogleData = JSON.parse(googleData);
              setGoogleProfileData(parsedGoogleData);
            } catch (error) {
              console.error('Error parsing Google data in navbar:', error);
            }
          }

          // Fetch user profile from API
          const response = await api.getProfile();
          setUserData(response.user_data);
        } catch (error) {
          console.error('Error fetching user profile in navbar:', error);
          // Fallback to currentUser data
          setUserData(currentUser);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, currentUser]);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    onLogout && onLogout();
    setShowProfileMenu(false);
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setShowProfileMenu(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideProfile = profileRef.current && !profileRef.current.contains(event.target);
      if (showProfileMenu && clickedOutsideProfile) {
        closeMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 backdrop-blur-sm sticky top-0 z-50 border-b border-blue-300/20 shadow-xl w-full">
      <div className="max-w-8xl mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to={isAuthenticated ? "/" : "/"} className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200/40 group-hover:border-blue-300/60 transition-all duration-300">
                <img src={logo} alt="SabApplier AI" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-white tracking-tight">
                SabApplier 
                <span className="text-blue-300 ml-1 font-extrabold">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              // Authenticated Navigation
              <>
                <Link 
                  to="/" 
                  className={`font-medium transition-all duration-300 hover:scale-105 relative group ${
                    location.pathname === '/' 
                      ? 'text-blue-300' 
                      : 'text-white/90 hover:text-blue-300'
                  }`}
                  onClick={closeMenus}>
                  Home
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/cart" 
                  className={`font-medium transition-all duration-300 hover:scale-105 relative group ${
                    location.pathname === '/cart' 
                      ? 'text-blue-300' 
                      : 'text-white/90 hover:text-blue-300'
                  }`}
                  onClick={closeMenus}>
                  <span className="flex items-center">
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 rounded-full min-w-5 text-center shadow-lg font-bold">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    location.pathname === '/cart' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/docs" 
                  className={`font-medium transition-all duration-300 hover:scale-105 relative group ${
                    location.pathname === '/docs' 
                      ? 'text-blue-300' 
                      : 'text-white/90 hover:text-blue-300'
                  }`}
                  onClick={closeMenus}>
                  Documents
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    location.pathname === '/docs' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/auto-fill-data" 
                  className={`font-medium transition-all duration-300 hover:scale-105 relative group ${
                    location.pathname === '/auto-fill-data' 
                      ? 'text-blue-300' 
                      : 'text-white/90 hover:text-blue-300'
                  }`}
                  onClick={closeMenus}>
                  Auto Fill
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    location.pathname === '/auto-fill-data' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              </>
            ) : (
              // Intro Page Navigation
              <>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  How it Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('privacy')}
                  className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  Privacy
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  Reviews
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </>
            )}
          </nav>

          {/* Desktop CTA/Profile Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              // Profile Section for Authenticated Users
              <div className="relative" ref={profileRef}>
                <button 
                  className={`flex items-center gap-3 px-4 py-2 text-white border border-white/30 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:border-blue-300/50 hover:shadow-md backdrop-blur-sm ${
                    showProfileMenu ? 'bg-white/10 border-blue-300/50' : ''
                  }`}
                  onClick={handleProfileClick}>
                  {/* Profile Image */}
                  <div className="relative">
                    {(userData?.google_profile_picture || googleProfileData?.picture) ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                        <img 
                          src={userData?.google_profile_picture || googleProfileData?.picture} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to default avatar if Google image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full hidden items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white/30">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {(userData?.google_profile_picture || googleProfileData?.picture) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white">
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block">
                    {userData?.fullName || userData?.fullname || googleProfileData?.name || currentUser?.email?.split('@')[0] || 'Profile'}
                  </span>
                  <svg className="w-4 h-4 transition-transform duration-200" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-blue-200/20 py-3 z-50 backdrop-blur-sm">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-6 py-3 text-white/90 hover:bg-white/10 hover:text-blue-300 transition-all duration-200 font-medium"
                      onClick={closeMenus}>
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Details
                    </Link>
                    <div className="border-t border-white/10 my-2"></div>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full text-left px-6 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-medium">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // CTA Buttons for Intro Page
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-white border border-white/30 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:border-blue-300/50 hover:shadow-md backdrop-blur-sm"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 border border-blue-400/30"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-blue-200/20 shadow-xl backdrop-blur-sm">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Profile Header (for authenticated users) */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="relative">
                    {(userData?.google_profile_picture || googleProfileData?.picture) ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                        <img 
                          src={userData?.google_profile_picture || googleProfileData?.picture} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to default avatar if Google image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full hidden items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white/30">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {(userData?.google_profile_picture || googleProfileData?.picture) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white">
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {userData?.fullName || userData?.fullname || googleProfileData?.name || 'User'}
                    </h3>
                    <p className="text-white/60 text-sm truncate">
                      {userData?.email || currentUser?.email}
                    </p>
                    {(userData?.google_profile_picture || googleProfileData) && (
                      <p className="text-green-400 text-xs">
                        Signed in with Google
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  // Authenticated Mobile Navigation
                  <>
                    <Link 
                      to="/" 
                      className={`block font-medium py-2 transition-colors duration-300 w-full text-left ${
                        location.pathname === '/' ? 'text-blue-300' : 'text-white/90 hover:text-blue-300'
                      }`}
                      onClick={closeMenus}>
                      Home
                    </Link>
                    <Link 
                      to="/cart" 
                      className={`flex items-center justify-between font-medium py-2 transition-colors duration-300 w-full text-left ${
                        location.pathname === '/cart' ? 'text-blue-300' : 'text-white/90 hover:text-blue-300'
                      }`}
                      onClick={closeMenus}>
                      Cart
                      {cartCount > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 rounded-full min-w-5 text-center shadow-lg font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/docs" 
                      className={`block font-medium py-2 transition-colors duration-300 w-full text-left ${
                        location.pathname === '/docs' ? 'text-blue-300' : 'text-white/90 hover:text-blue-300'
                      }`}
                      onClick={closeMenus}>
                      Documents
                    </Link>
                    <Link 
                      to="/auto-fill-data" 
                      className={`block font-medium py-2 transition-colors duration-300 w-full text-left ${
                        location.pathname === '/auto-fill-data' ? 'text-blue-300' : 'text-white/90 hover:text-blue-300'
                      }`}
                      onClick={closeMenus}>
                      Auto Fill Data
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`block font-medium py-2 transition-colors duration-300 w-full text-left ${
                        location.pathname === '/profile' ? 'text-blue-300' : 'text-white/90 hover:text-blue-300'
                      }`}
                      onClick={closeMenus}>
                      My Details
                    </Link>
                  </>
                ) : (
                  // Intro Page Mobile Navigation
                  <>
                    <button 
                      onClick={() => scrollToSection('features')}
                      className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                    >
                      Features
                    </button>
                    <button 
                      onClick={() => scrollToSection('how-it-works')}
                      className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                    >
                      How it Works
                    </button>
                    <button 
                      onClick={() => scrollToSection('privacy')}
                      className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                    >
                      Privacy
                    </button>
                    <button 
                      onClick={() => scrollToSection('testimonials')}
                      className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                    >
                      Reviews
                    </button>
                  </>
                )}
              </div>
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-center px-4 py-3 text-red-400 border border-red-400/30 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-red-500/10">
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block w-full text-center px-4 py-3 text-white border border-white/30 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
