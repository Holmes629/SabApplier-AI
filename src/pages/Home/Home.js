import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';

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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to SabApplier AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Apply faster & easier with AI-powered automation
          </p>
          
          {/* Extension Download Button */}
          <div className="mb-8">
            <a
              href="https://chromewebstore.google.com/detail/pbokcepmfdenanohfjfgkilcpgceohhl?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Get Our Extension
            </a>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />
        
        {/* Applications Grid */}
        <div className="grid gap-6 mb-12">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(app => (
              <JobCard 
                key={app.id} 
                application={app} 
                onCart={() => onToggleCart(app.id)}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Privacy Policy Link */}
        <div className="text-center py-8 border-t border-gray-200">
          <Link 
            to="/privacy_policy" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Our Privacy Policy
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home; 