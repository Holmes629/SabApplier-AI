import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ application, onCart }) {
  const handleClick = (e) => {
    // Prevent navigation if clicking on cart button or official link
    if (e.target.closest('.cart-button') || e.target.closest('.visit-link')) {
      e.preventDefault();
    }
  };

  return (
    <Link 
      to={`/exam/${application.id}`} 
      className="job-card"
      onClick={handleClick}
    >
      <div className="job-card-left">
        <div className="company-logo"></div>
      </div>
      <div className="job-card-content">
        <h3 className="job-title">{application.title}</h3>
        <div className={`job-status ${application.isApplied ? 'applied' : ''}`}>
          <span data-status={application.status}>{application.status}</span>
          {application.isApplied && <span className="applied-tag">Applied</span>}
        </div>
        <div className="job-details">
          <div className="detail-item">
            <span className="detail-label">Application Fees</span>
            <span className="detail-value">{application.applicationFees}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Deadline</span>
            <span className="detail-value">{application.deadline}</span>
          </div>
        </div>
      </div>
      <div className="job-card-right">
        <a 
          href={application.officialLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="visit-link"
          onClick={(e) => e.stopPropagation()}
        >
          Visit official site →
        </a>
        <button 
          className={`cart-button ${application.isCart ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onCart();
          }}
          aria-label={application.isCart ? "Remove from cart" : "Add to cart"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={application.isCart ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>
    </Link>
  );
}

export default JobCard; 