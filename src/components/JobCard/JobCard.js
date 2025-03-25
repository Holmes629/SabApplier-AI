import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ application, onShortlist }) {
  const handleClick = (e) => {
    // Prevent navigation if clicking on star button or official link
    if (e.target.closest('.star-button') || e.target.closest('.visit-link')) {
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
        <button 
          className={`star-button ${application.isShortlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onShortlist();
          }}
          aria-label={application.isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={application.isShortlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
        <a 
          href={application.officialLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="visit-link"
          onClick={(e) => e.stopPropagation()}
        >
          Visit official site →
        </a>
      </div>
    </Link>
  );
}

export default JobCard; 