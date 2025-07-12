import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Shield, Star, CheckCircle } from 'lucide-react';

const Waitlist = () => {
  const { user, logout, checkWebsiteAccess, hasWebsiteAccess } = useAuth();
  const navigate = useNavigate();
  const [signupCount, setSignupCount] = useState(487); // Dynamic count
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Check if user has gained access and redirect
  useEffect(() => {
    if (hasWebsiteAccess) {
      navigate('/', { replace: true });
    }
  }, [hasWebsiteAccess, navigate]);

  // Mouse position tracking for grid spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      setSignupCount(prev => prev + Math.floor(Math.random() * 2));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const profileIcons = [
    { Icon: User, color: 'from-blue-400 to-blue-600' },
    { Icon: GraduationCap, color: 'from-purple-400 to-purple-600' },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Install Chrome Extension Button - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <a
          href="https://chromewebstore.google.com/detail/sabapplier-ai-react-smart/pbokcepmfdenanohfjfgkilcpgceohhl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
          Install Extension
        </a>
      </div>

      {/* Grid Spotlight Effect - Light grid background with highlighted cell */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light grid pattern background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        
        {/* Single highlighted grid cell - only visible where cursor is */}
        <div
          className="absolute transition-all duration-200 ease-out"
          style={{
            left: Math.floor(mousePosition.x / 40) * 40,
            top: Math.floor(mousePosition.y / 40) * 40,
            width: '40px',
            height: '40px',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 0 8px rgba(59, 130, 246, 0.15)',
            zIndex: 2
          }}
        />
      </div>

      {/* Static floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40 top-20 left-20" />
        <div className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 top-32 right-32" />
        <div className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-35 bottom-40 left-16" />
        <div className="absolute w-1 h-1 bg-green-400 rounded-full opacity-45 bottom-60 right-20" />
        <div className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-30 top-60 left-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Enhanced content with Hero styling */}
          <div className="text-center lg:text-left flex flex-col justify-center h-full py-8">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-600 mb-8 shadow-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                  <span>WAITLIST STATUS</span>
                </div>
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
              You're 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent block lg:inline"> Almost There! </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Great news! You're in our exclusive waitlist. We're crafting an incredible AI-powered experience just for you.
            </p>

            {/* User status card */}
            <div className="mb-8">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 max-w-md mx-auto lg:mx-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                    {user?.email?.charAt(0)?.toUpperCase() || '7'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{user?.fullName || 'Ritesh Kumar'}</h3>
                    <p className="text-sm text-gray-500 mt-1">{user?.email || '7976ritesh@gmail.com'}</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300/50 rounded-full shadow-sm">
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse mr-3"></div>
                    <span className="text-yellow-800 font-semibold text-sm">On Waitlist</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </div>
              </button>
              
              <a
                href="mailto:support@sabapplier.com"
                className="bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Contact Support
                </div>
              </a>
            </div>

            {/* Enhanced social proof with Lucide icons */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
              <div className="flex -space-x-2">
                {profileIcons.map((item, index) => {
                  const { Icon, color } = item;
                  return (
                    <div
                      key={index}
                      className={`w-8 h-8 bg-gradient-to-br ${color} rounded-full flex items-center justify-center text-white border-2 border-white shadow-md transform hover:scale-110 transition-all duration-300 cursor-pointer`}
                      style={{
                        zIndex: profileIcons.length - index
                      }}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  );
                })}
              </div>
              <div className="text-left">
                <div className="text-gray-800 font-bold">
                  {signupCount}+
                </div>
                <div className="text-gray-600 text-sm">
                  People joined
                </div>
              </div>
            </div>

            {/* Trust indicators with Lucide icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start space-x-2 p-3 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Early Access</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 p-3 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Premium Features</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 p-3 bg-white/60 rounded-lg backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Priority Support</span>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced mobile mockup with Hero styling */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Three overlapping cards/forms matching the provided image */}
              <div className="relative w-96 h-[500px] flex items-center justify-center">
                {/* Back card (left) - Light purple/pink */}
                <div className="absolute w-72 h-96 bg-gradient-to-br from-pink-100 to-purple-200 rounded-3xl shadow-xl transform rotate-[-12deg] -translate-x-16 translate-y-4 border border-pink-200/50">
                  <div className="p-8 space-y-6">
                    <div className="w-12 h-12 bg-white/70 rounded-2xl mb-6"></div>
                    <div className="space-y-4">
                      <div className="w-full h-3 bg-purple-300/50 rounded-full"></div>
                      <div className="w-5/6 h-3 bg-purple-300/40 rounded-full"></div>
                      <div className="w-4/6 h-3 bg-purple-300/30 rounded-full"></div>
                      <div className="w-3/6 h-3 bg-purple-300/30 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Back card (right) - Light purple/pink */}
                <div className="absolute w-72 h-96 bg-gradient-to-br from-pink-100 to-purple-200 rounded-3xl shadow-xl transform rotate-[12deg] translate-x-16 translate-y-4 border border-pink-200/50">
                  <div className="p-8 space-y-6">
                    <div className="w-12 h-12 bg-white/70 rounded-2xl mb-6"></div>
                    <div className="space-y-4">
                      <div className="w-full h-3 bg-purple-300/50 rounded-full"></div>
                      <div className="w-5/6 h-3 bg-purple-300/40 rounded-full"></div>
                      <div className="w-4/6 h-3 bg-purple-300/30 rounded-full"></div>
                      <div className="w-3/6 h-3 bg-purple-300/30 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Front card (center) - Blue with content */}
                <div className="relative w-80 h-[420px] bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-300 rounded-3xl shadow-2xl z-10 border border-blue-300/50">
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-5">
                      <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <img src="/logo.jpeg" alt="SabApplier" className="w-12 h-12 rounded-xl object-cover" />
                        )}
                      </div>
                      <h3 className="text-base font-bold text-gray-800 mb-1">SabApplier AI</h3>
                      <p className="text-xs text-gray-600">Auto-Fill Assistant</p>
                    </div>

                    {/* Form Preview */}
                    <div className="space-y-2 flex-1">
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-white/60 shadow-sm">
                        <div className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">Full Name</div>
                        <div className="text-sm font-semibold text-gray-800">Ritesh Kumar</div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-white/60 shadow-sm">
                        <div className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">Email Address</div>
                        <div className="text-sm font-semibold text-gray-800">ritesh@example.com</div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-white/60 shadow-sm">
                        <div className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">Experience</div>
                        <div className="text-sm font-semibold text-gray-800">3 Years</div>
                      </div>
                    </div>

                    {/* Success indicator */}
                    <div className="mt-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-2.5 shadow-sm">
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold">Auto-Filled!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speed indicator */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  95% Faster
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
