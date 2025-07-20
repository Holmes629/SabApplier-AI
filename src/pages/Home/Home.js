import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';
import Footer from '../../components/Footer/Footer';
import { LoadingProgressBar } from '../../components/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Gift } from 'lucide-react';

const Home = ({ applications, /* onToggleCart, */ loadingExams }) => {
  const { user, updateUser } = useAuth();
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let filtered = applications || [];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.title?.toLowerCase() || '').includes(term) ||
        (app.category?.toLowerCase() || '').includes(term) ||
        (app.conductingBody?.toLowerCase() || '').includes(term) ||
        (app.eligibility?.toLowerCase() || '').includes(term)
      );
    }

    setFilteredApplications(filtered);
    console.log('📊 Total applications loaded:', applications?.length || 0);
    console.log('🔍 Filtered results:', filtered.length, 'exams found');
  }, [applications, searchTerm]);

  // Simulate loading progress when loadingExams is true
  useEffect(() => {
    if (loadingExams) {
      setLoadingProgress(0);
      const intervals = [
        { delay: 200, progress: 15 },
        { delay: 600, progress: 35 },
        { delay: 1200, progress: 55 },
        { delay: 1800, progress: 75 },
        { delay: 2400, progress: 90 },
        { delay: 3000, progress: 100 }
      ];

      const timeouts = intervals.map(({ delay, progress }) =>
        setTimeout(() => setLoadingProgress(progress), delay)
      );

      return () => timeouts.forEach(clearTimeout);
    } else {
      setLoadingProgress(100);
    }
  }, [loadingExams]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleRefreshExams = async () => {
    console.log('🔄 Manual refresh triggered');
    localStorage.removeItem('applications');
    window.location.reload();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="space-y-2 mb-2">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex gap-1 mb-3">
          <div className="h-5 bg-gray-300 rounded-full w-16"></div>
          <div className="h-5 bg-gray-300 rounded-full w-14"></div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2 space-y-1">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-14"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-14"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state with 4x3 grid of skeleton cards (12 total) and progress bar
  const LoadingState = () => (
    <div className="space-y-6">
      {/* Loading Progress Bar */}
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Competitive Exams</h3>
          <p className="text-sm text-gray-600 mb-4">
            {loadingProgress < 30 ? 'Initializing exam data...' : 
             loadingProgress < 60 ? 'Fetching exam details...' : 
             loadingProgress < 90 ? 'Processing exam information...' : 
             'Finalizing exam list...'}
          </p>
        </div>
        <LoadingProgressBar 
          percentage={loadingProgress}
          showPercentage={true}
          size="normal"
        />
      </div>
      
      {/* Skeleton Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
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
        
        {/* Exam Section Header */}
        {/* <div className="mb-6 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-4 text-blue-700 font-semibold text-base gap-2 shadow-sm">
          <Gift className="w-5 h-5 text-yellow-500" />
          <span>You’re 1 invite away from unlocking Premium! <span className="font-bold">Unlock all features before exam season rush!</span></span>
        </div> */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-0">
                {searchTerm ? 'Search Results' : 'All Competitive Exams'}
              </h2>
              
              
              {/* Mini progress bar in header when loading */}
              {loadingExams && (
                <div className="mt-2 w-48">
                  <LoadingProgressBar 
                    percentage={loadingProgress}
                    size="small"
                    showPercentage={false}
                  />
                </div>
              )}
            </div>
            {!loadingExams && (
              <div className="mt-4 sm:mt-0 flex items-center gap-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {(applications || []).length} Total Exams
                </div>
                {(applications || []).length < 12 && (
                  <button
                    onClick={handleRefreshExams}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Applications Grid */}
        <div className="mb-12">
          {loadingExams ? (
            <LoadingState />
          ) : filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApplications.map(app => (
                <JobCard 
                  key={app.id} 
                  application={app} 
                  // onCart={() => onToggleCart(app.id)}
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
        
      </main>
      <Footer />
    </div>
  );
};

export default Home; 