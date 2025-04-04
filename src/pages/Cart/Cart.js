import React from 'react';
import JobCard from '../../components/JobCard/JobCard';
import './Cart.css';

function Cart({ applications, onToggleCart }) {
  const cartApps = applications.filter(app => app.isCart);

  return (
    <main className="main-content">
      <h2 className="page-title">Cart</h2>
      <div className="job-cards-container">
        {cartApps.length === 0 ? (
          <div className="empty-state">
            <p>No applications in cart yet</p>
            <p className="empty-state-subtitle">Add your favorite applications to cart</p>
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
  );
}

export default Cart; 