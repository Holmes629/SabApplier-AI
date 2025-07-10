import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Waitlist = () => {
  const { user, logout, checkWebsiteAccess, hasWebsiteAccess } = useAuth();
  const navigate = useNavigate();
  const [signupCount, setSignupCount] = useState(4567); // Dynamic count
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  // Check if user has gained access and redirect
  useEffect(() => {
    if (hasWebsiteAccess) {
      navigate('/', { replace: true });
    }
  }, [hasWebsiteAccess, navigate]);

  // Periodic access check
  useEffect(() => {
    const checkAccessPeriodically = async () => {
      if (user?.email) {
        try {
          await checkWebsiteAccess(user.email);
        } catch (error) {
          console.error('Periodic access check failed:', error);
        }
      }
    };

    // Check access every 30 seconds
    const accessInterval = setInterval(checkAccessPeriodically, 30000);

    return () => clearInterval(accessInterval);
  }, [user?.email, checkWebsiteAccess]);

  // Manual access check
  const handleCheckAccess = async () => {
    if (user?.email) {
      setIsCheckingAccess(true);
      try {
        await checkWebsiteAccess(user.email);
      } catch (error) {
        console.error('Manual access check failed:', error);
      } finally {
        setIsCheckingAccess(false);
      }
    }
  };

  // Handle logout and redirect to intro
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/intro', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      navigate('/intro', { replace: true });
    }
  };

  useEffect(() => {
    // Simulate periodic count updates
    const interval = setInterval(() => {
      setSignupCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const profileAvatars = [
    '👨‍💻', '👩‍💼', '👨‍🎓', '👩‍🔬'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Mobile mockup */}
        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <div className="relative">
            {/* Phone frame */}
            <div className="relative w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                {/* Status bar */}
                <div className="flex justify-between items-center px-6 py-3 text-sm font-medium">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24">
                      <path d="M2 16h20v2H2zm1.5-5L12 7l8.5 4v2H3.5V11z"/>
                    </svg>
                  </div>
                </div>

                {/* App content */}
                <div className="px-6 pb-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Stats cards */}
                  <div className="space-y-4 mb-6">
                    {/* Total applications */}
                    <div className="bg-blue-600 rounded-2xl p-4 text-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-blue-100 text-sm">Total Applications</p>
                          <p className="text-2xl font-bold">18,890</p>
                          <p className="text-blue-200 text-xs">+12.5% from last month</p>
                        </div>
                        <div className="w-12 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="w-full bg-blue-500 rounded-full h-1">
                        <div className="bg-white h-1 rounded-full w-3/4"></div>
                      </div>
                    </div>

                    {/* Forms submitted */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-gray-600 text-sm">Forms Submitted</p>
                        <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">+18.2%</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">4,862</p>
                    </div>

                    {/* Success rate */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-gray-600 text-sm">Success Rate</p>
                        <span className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">+5.4%</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">2,671</p>
                    </div>

                    {/* Accuracy */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-gray-600 text-sm">Accuracy</p>
                        <div className="flex items-center">
                          <div className="w-8 h-2 bg-green-200 rounded-full mr-2">
                            <div className="w-6 h-2 bg-green-600 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-600">82%</span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-gray-900">92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-cyan-200 rounded-full animate-pulse"></div>
            <div className="absolute top-20 -right-6 w-4 h-4 bg-purple-200 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="text-center lg:text-left order-1 lg:order-2">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-600 mb-8">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            COMING SOON
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
            You're on the
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent block lg:inline"> waitlist! </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Thank you for joining SabApplier AI! We're preparing an amazing experience for you. 
            You'll get access as soon as we're ready.
          </p>

          {/* User status */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.fullName || 'User'}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">Status: On Waitlist</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <button
              onClick={handleCheckAccess}
              disabled={isCheckingAccess}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isCheckingAccess ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Checking...
                </div>
              ) : (
                'Check Access Status'
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
            <a
              href="mailto:support@sabapplier.com"
              className="bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-center"
            >
              Contact Support
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="flex -space-x-2">
              {profileAvatars.map((avatar, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm border-2 border-white"
                >
                  {avatar}
                </div>
              ))}
            </div>
            <span className="text-gray-600 font-medium">
              {signupCount.toLocaleString()} people signed up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
