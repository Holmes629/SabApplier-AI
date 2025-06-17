import React from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';

function Cart({ applications, onToggleCart }) {
  const cartApps = applications.filter(app => app.isCart);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-30 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700 mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your Application Cart
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Saved <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Applications</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {cartApps.length} {cartApps.length === 1 ? 'application' : 'applications'} ready for you to apply
          </p>
        </div>
        
        {/* Content Section */}
        <div className="mb-16">
          {cartApps.length === 0 ? (
            /* Empty Cart State */
            <div className="max-w-2xl mx-auto">
              <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl border border-blue-100 relative overflow-hidden">
                {/* Background decoration for empty state */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300 rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Start building your application portfolio by adding opportunities that match your interests and qualifications.
                  </p>
                  <div className="space-y-4">
                    <Link 
                      to="/" 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Applications
                    </Link>
                    <div className="text-sm text-gray-500">
                      <p>💡 Tip: Use the heart icon to save applications for later</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Applications Grid */
            <div className="space-y-8">
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Apply</h3>
                    <p className="text-gray-600">
                      You have <span className="font-bold text-blue-600">{cartApps.length}</span> application{cartApps.length !== 1 ? 's' : ''} in your cart
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      Apply to All
                    </button>
                    <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300">
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Applications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cartApps.map(app => (
                  <JobCard 
                    key={app.id} 
                    application={app} 
                    onCart={() => onToggleCart(app.id)}
                  />
                ))}
              </div>

              {/* Action Bar */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg sticky bottom-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {cartApps.length} application{cartApps.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                      Save for Later
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-md">
                      Start Applying
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Cart; 