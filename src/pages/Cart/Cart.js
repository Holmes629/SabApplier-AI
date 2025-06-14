import React from 'react';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';

function Cart({ applications, onToggleCart }) {
  const cartApps = applications.filter(app => app.isCart);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cart</h2>
          <p className="text-gray-600">
            {cartApps.length} {cartApps.length === 1 ? 'application' : 'applications'} in your cart
          </p>
        </div>
        
        <div className="grid gap-6 mb-12">
          {cartApps.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add your favorite applications to cart to get started</p>
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Applications
              </a>
            </div>
          ) : (
            cartApps.map(app => (
              <JobCard 
                key={app.id} 
                application={app} 
                onCart={() => onToggleCart(app.id)}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Cart; 