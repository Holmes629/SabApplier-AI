import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = ({ applications, onToggleCart }) => {
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
    <div className="body">
      <main className="main-content">
        <h1 className="page-title-home">Welcome to SabApplier AI</h1>
        <p className="page-subtitle-home">Apply faster & easier</p>
        <SearchBar onSearch={handleSearch} />
        <div className="job-cards-container">
          {filteredApplications.map(app => (
            <JobCard 
              key={app.id} 
              application={app} 
              onCart={() => onToggleCart(app.id)}
            />
          ))}
        </div>
        <div className='privacy-policy'>
          <Link to="/privacy_policy"> Our Privacy Policy </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home; 