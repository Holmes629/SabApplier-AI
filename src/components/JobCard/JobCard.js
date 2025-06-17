import React from 'react';

function JobCard({ application, onCart }) {
  const handleCardClick = (e) => {
    // Prevent opening website if clicking on cart button
    if (e.target.closest('.cart-button')) {
      return;
    }
    
    // Open the official exam website in a new tab
    if (application.officialLink) {
      window.open(application.officialLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div 
        className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 p-4 hover:border-blue-300 hover:scale-[1.02] group cursor-pointer relative" 
        onClick={handleCardClick}
        title={`Click to visit ${application.conductingBody} official website`}
      >
        {/* External Link Indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <div className="flex flex-col h-full">
          {/* Header with Icon and Cart Button */}
          <div className="flex items-start justify-between mb-3 relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className={`cart-button p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 z-10 ${
                  application.isCart 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCart();
                }}
                aria-label={application.isCart ? "Remove from cart" : "Add to cart"}
              >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill={application.isCart ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">{application.title}</h3>
          
          {/* Conducting Body */}
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            {application.conductingBody}
          </p>
          
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
              application.status === 'Open' ? 'bg-green-50 text-green-700 border-green-200' :
              application.status === 'Closed' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}>
              {application.status}
            </span>
            {application.isApplied && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                ✓ Applied
              </span>
            )}
          </div>

          {/* Dates */}
          <div className="space-y-2 bg-blue-50 rounded-lg p-3 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium text-xs">Notification:</span>
              <span className="text-gray-900 text-xs font-medium">{application.notificationDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium text-xs">Deadline:</span>
              <span className="text-red-600 font-bold text-xs">{application.deadline}</span>
            </div>
          </div>
          
          {/* Click to visit CTA - appears on hover */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-center text-blue-600 text-sm font-medium py-2 bg-blue-50 rounded-lg border border-blue-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Click to visit official website
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobCard; 