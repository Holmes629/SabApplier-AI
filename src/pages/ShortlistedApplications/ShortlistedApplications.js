import React from 'react';
import JobCard from '../../components/JobCard/JobCard';
import './ShortlistedApplications.css';

function ShortlistedApplications({ applications, onToggleShortlist }) {
  const shortlistedApps = applications.filter(app => app.isShortlisted);

  return (
    <main className="main-content">
      <h2 className="page-title">Shortlisted Applications</h2>
      <div className="job-cards-container">
        {shortlistedApps.length === 0 ? (
          <div className="empty-state">
            <p>No applications shortlisted yet</p>
            <p className="empty-state-subtitle">Star your favorite applications to see them here</p>
          </div>
        ) : (
          shortlistedApps.map(app => (
            <JobCard 
              key={app.id} 
              application={app} 
              onShortlist={() => onToggleShortlist(app.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default ShortlistedApplications; 