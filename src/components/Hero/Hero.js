import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Cpath d='M30 15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-semibold text-blue-300 mb-8 shadow-lg backdrop-blur-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                </svg>
                AI-Powered Form Assistant
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Simplify Your 
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block lg:inline"> Form-Filling </span>
              Journey
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Upload once. Let AI do the rest. Transform hours of repetitive form filling into seconds of smart automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
              <Link to="/login">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-blue-400/30">
                  Get Started Free
                </button>
              </Link>
              
              <a
                href="https://chromewebstore.google.com/detail/pbokcepmfdenanohfjfgkilcpgceohhl?utm_source=item-share-cb"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-blue-300/40 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-500/20 hover:border-blue-300/60 transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Extension
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg lg:max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100 font-medium">10,000+ Forms Filled</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100 font-medium">95% Time Saved</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-100 font-medium">Bank-Level Security</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Visual */}
          <div className="lg:block hidden">
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative w-full max-w-lg mx-auto h-96">
                {/* Floating particles animation */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute top-20 right-16 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-32 right-12 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping delay-700"></div>
                <div className="absolute top-32 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-16 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-1200"></div>

                {/* Animated connection lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:0.3}} />
                      <stop offset="100%" style={{stopColor:'#06b6d4', stopOpacity:0.1}} />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M50,50 Q150,100 250,80 T350,120" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="2" 
                    fill="none"
                    className="animate-pulse"
                    strokeDasharray="5,5"
                  />
                  <path 
                    d="M80,200 Q180,150 280,180 T380,160" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="1.5" 
                    fill="none"
                    className="animate-pulse delay-500"
                    strokeDasharray="3,3"
                  />
                </svg>

                {/* Background browser window */}
                <div className="absolute top-4 right-4 w-72 h-84 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl transform rotate-2 animate-float">
                  <div className="p-4">
                    {/* Browser header */}
                    <div className="flex items-center mb-4 pb-3 border-b border-white/20">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-6 bg-white/10 rounded-full px-3 text-xs text-white/60 flex items-center">
                          🔒 application-form.gov.in
                        </div>
                      </div>
                    </div>
                    {/* Form content skeleton */}
                    <div className="space-y-3">
                      <div className="w-full h-3 bg-blue-300/20 rounded animate-pulse"></div>
                      <div className="w-3/4 h-3 bg-blue-300/20 rounded animate-pulse delay-100"></div>
                      <div className="w-1/2 h-3 bg-blue-300/20 rounded animate-pulse delay-200"></div>
                      <div className="w-full h-12 bg-blue-400/20 rounded-lg border border-dashed border-blue-300/30 mt-4"></div>
                    </div>
                  </div>
                </div>

                {/* Main form card with auto-fill animation */}
                <div className="relative w-72 h-84 bg-white rounded-2xl shadow-2xl transform -rotate-2 border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-white rounded-lg mr-3 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-white font-semibold text-sm">Job Application Form</div>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Form fields with typing animation */}
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-xs text-gray-600 block mb-1">Full Name</label>
                        <div className="h-8 bg-gray-100 rounded border relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-x-full animate-slide-in opacity-20"></div>
                          <div className="relative z-10 px-2 py-1.5 text-xs text-gray-700">
                            <span className="typewriter">Ritesh Kumar</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-xs text-gray-600 block mb-1">Email Address</label>
                        <div className="h-8 bg-gray-100 rounded border relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transform -translate-x-full animate-slide-in-delay opacity-20"></div>
                          <div className="relative z-10 px-2 py-1.5 text-xs text-gray-700">
                            <span className="typewriter-delay">ritesh@example.com</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                        <div className="h-8 bg-gray-100 rounded border relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transform -translate-x-full animate-slide-in-delay-2 opacity-20"></div>
                          <div className="relative z-10 px-2 py-1.5 text-xs text-gray-700">
                            <span className="typewriter-delay-2">+91 9876543210</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-xs text-gray-600 block mb-1">Experience</label>
                        <div className="h-8 bg-gray-100 rounded border relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 transform -translate-x-full animate-slide-in-delay-3 opacity-20"></div>
                          <div className="relative z-10 px-2 py-1.5 text-xs text-gray-700">
                            <span className="typewriter-delay-3">3 Years</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Success notification */}
                    <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200 opacity-0 animate-fade-in-up relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-shimmer"></div>
                      <div className="relative flex items-center text-green-700">
                        <svg className="w-5 h-5 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Form Auto-Filled Successfully!</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">Saved 5 minutes of typing ⚡</div>
                    </div>
                  </div>
                </div>

                

                {/* Speed indicator */}
                <div className="absolute bottom-4 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce-slow">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    95% Faster
                  </div>
                </div>

                

                {/* Floating document icons */}
                <div className="absolute top-6 right-20 w-6 h-6 bg-white/20 backdrop-blur rounded opacity-60 animate-float flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="absolute bottom-16 left-24 w-5 h-5 bg-white/20 backdrop-blur rounded opacity-60 animate-float delay-700 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
