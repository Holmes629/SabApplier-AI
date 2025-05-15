import React from 'react';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';
import './TrackApplications.css';

function TrackApplications({ applications, onShortlist }) {
  const appliedApps = applications.filter(app => app.isApplied);

  return (
    <div className="body">
      <main className="main-content">
        <h2 className="page-title">Track My Applications</h2>
        <div className="job-cards-container">
          {appliedApps.length === 0 ? (
            <div className="empty-state">
              <p>No applications submitted yet</p>
              <p className="empty-state-subtitle">Your submitted applications will appear here</p>
            </div>
          ) : (
            appliedApps.map(app => (
              <JobCard 
                key={app.id} 
                application={app} 
                onShortlist={() => onShortlist(app.id)}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TrackApplications; 