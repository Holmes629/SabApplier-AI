import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';

const Home = ({ applications, onToggleCart, loadingExams }) => {
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
      (app.category?.toLowerCase() || '').includes(term) ||
      (app.conductingBody?.toLowerCase() || '').includes(term) ||
      (app.eligibility?.toLowerCase() || '').includes(term)
    );

    setFilteredApplications(filtered);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="bg-gray-100 rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state with 3x3 grid of skeleton cards (9 total)
  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
        <LoadingSkeleton key={index} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to SabApplier AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Apply for competitive exams faster & easier with AI-powered automation
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
        <div className="mb-12">
          {loadingExams ? (
            <LoadingState />
          ) : filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map(app => (
                <JobCard 
                  key={app.id} 
                  application={app} 
                  onCart={() => onToggleCart(app.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No competitive exams found</h3>
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