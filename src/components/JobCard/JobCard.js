import React from 'react';
import { Link } from 'react-router-dom';

function JobCard({ application, onCart }) {
  const handleClick = (e) => {
    // Prevent navigation if clicking on cart button or official link
    if (e.target.closest('.cart-button') || e.target.closest('.visit-link')) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Link 
        to={`/exam/${application.id}`} 
        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 p-6 hover:border-blue-300" 
        onClick={handleClick}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{application.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                application.status === 'Open' ? 'bg-green-100 text-green-800' :
                application.status === 'Closed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {application.status}
              </span>
              {application.isApplied && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Applied
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Notification Date:</span>
                <span className="text-gray-900">{application.notificationDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Deadline:</span>
                <span className="text-gray-900 font-medium">{application.deadline}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button 
              className={`p-3 rounded-lg transition-all duration-200 ${
                application.isCart 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
              }`}
              onClick={(e) => {
                e.preventDefault();
                onCart();
              }}
              aria-label={application.isCart ? "Remove from cart" : "Add to cart"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill={application.isCart ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}

export default JobCard; 