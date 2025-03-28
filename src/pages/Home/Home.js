import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';
import './Home.css';

const Home = ({ applications, onToggleShortlist }) => {
  const [filteredApplications, setFilteredApplications] = useState(applications);

  useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredApplications(applications);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = applications.filter(app => 
      (app.title?.toLowerCase() || '').includes(term) ||
      (app.company?.toLowerCase() || '').includes(term) ||
      (app.location?.toLowerCase() || '').includes(term)
    );

    setFilteredApplications(filtered);
  };

  return (
    <main className="main-content">
      <h1 className="page-title">Welcome to SabApplier AI</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="job-cards-container">
        {filteredApplications.map(app => (
          <JobCard 
            key={app.id} 
            application={app} 
            onShortlist={() => onToggleShortlist(app.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default Home; 