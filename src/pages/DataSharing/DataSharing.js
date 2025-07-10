import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { api } from '../../services/api';
import { Share2, Send, Inbox, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

// Document fields mapping from Docs.js
const DOCUMENT_FIELDS = {
  passport_size_photo_file_url: "Passport Size Photo",
  aadhaar_card_file_url: "Aadhaar Card",
  pan_card_file_url: "PAN Card",
  signature_file_url: "Signature",
  _10th_certificate_file_url: "10th Certificate",
  _12th_certificate_file_url: "12th Certificate",
  graduation_certificate_file_url: "Graduation Certificate",
  left_thumb_file_url: "Left Thumb",
  caste_certificate_file_url: "Caste Certificate",
  pwd_certificate_file_url: "PWD Certificate",
  domicile_certificate_file_url: "Domicile Certificate",
};

function DataSharing() {
  const navigate = useNavigate();
  const [friendEmail, setFriendEmail] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sharesData, setSharesData] = useState({
    received_shares: [],
    sent_shares: []
  });
  const [notifications, setNotifications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [userDocuments, setUserDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadSharesData();
    loadNotifications();
    loadUserDocuments();
  }, []);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const loadUserDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await api.getProfile();
      // Extract documents using the same structure as Docs.js
      const documents = [];
      
      if (response.user_data) {
        // Check each document field from DOCUMENT_FIELDS
        Object.entries(DOCUMENT_FIELDS).forEach(([field, label]) => {
          if (response.user_data[field]) {
            documents.push({ 
              name: label, 
              type: field, 
              url: response.user_data[field] 
            });
          }
        });
      }
      
      setUserDocuments(documents);
    } catch (error) {
      console.error('Error loading user documents:', error);
      setUserDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadSharesData = async () => {
    try {
      setLoadingData(true);
      const response = await api.getUserShares();
      setSharesData(response);
    } catch (error) {
      console.error('Error loading shares data:', error);
      setErrorMessage('Failed to load shares data: ' + error.message);
    } finally {
      setLoadingData(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await api.getUserNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleDocumentToggle = (documentType) => {
    setSelectedDocuments(prev => 
      prev.includes(documentType) 
        ? prev.filter(doc => doc !== documentType)
        : [...prev, documentType]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === userDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(userDocuments.map(doc => doc.type));
    }
  };

  const handleShareData = async () => {
    if (!friendEmail) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.shareDataWithFriend(friendEmail, selectedDocuments);
      
      let successMsg = `Sharing request sent to ${friendEmail} successfully!`;
      if (selectedDocuments.length > 0) {
        const selectedDocNames = userDocuments
          .filter(doc => selectedDocuments.includes(doc.type))
          .map(doc => doc.name);
        successMsg += ` Selected documents: ${selectedDocNames.join(', ')}`;
      } else {
        successMsg += ' All available data will be shared.';
      }
      
      setSuccessMessage(successMsg);
      setFriendEmail('');
      setSelectedDocuments([]);
      // Reload the shares data to show the new request
      await loadSharesData();
    } catch (error) {
      console.error('Error sharing data:', error);
      setErrorMessage('Failed to send sharing request: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (shareId, action) => {
    try {
      await api.respondToShareRequest(shareId, action);
      setSuccessMessage(`Request ${action}ed successfully!`);
      // Reload the shares data to reflect the change
      await loadSharesData();
      await loadNotifications();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setErrorMessage(`Failed to ${action} request: ` + error.message);
    }
  };

  const handleStopSharing = async (receiverEmail) => {
    try {
      await api.stopDataSharing(receiverEmail);
      setSuccessMessage(`Stopped sharing with ${receiverEmail}`);
      await loadSharesData();
    } catch (error) {
      console.error('Error stopping share:', error);
      setErrorMessage('Failed to stop sharing: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern - matching other pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg flex items-center max-w-md">
          <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
          <span className="text-sm">{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="ml-2 text-green-600 hover:text-green-800 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg flex items-center max-w-md">
          <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
          <span className="text-sm">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-2 text-red-600 hover:text-red-800 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section - matching other pages */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Document Sharing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-3">
            <span className="font-semibold text-dark">Share</span> your documents securely with friends and colleagues. 
            <span className="font-semibold text-dark"> Control</span> what you share and <span className="font-semibold text-dark">manage</span> all requests in one place.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Send sharing requests, accept or decline incoming requests, and monitor all your sharing activities.
          </p>
        </div>

        {/* Documents Grid - Enhanced with matching theme */}
        <div className="space-y-6">
          {/* Share Data Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-center mr-3">
                <Share2 className="w-5 h-5 text-dark" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Share Your Documents</h2>
            </div>
            
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient's Email Address
              </label>
              <input
                type="email"
                placeholder="Enter recipient's email address"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              />
            </div>

            {/* Document Selection */}
            <div className="mb-6">
              {loadingDocuments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your documents...</p>
                </div>
              ) : userDocuments.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      <FileText className="w-4 h-4 inline mr-2 text-blue-600" />
                      Select Documents to Share ({userDocuments.length} available) - Optional
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                    >
                      {selectedDocuments.length === userDocuments.length ? '✓ Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      <span className="font-medium">Optional:</span> Select specific documents to share, or leave empty to share all available data.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {userDocuments.map((document) => (
                        <div
                          key={document.type}
                          className={`rounded-xl border p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer ${
                            selectedDocuments.includes(document.type)
                              ? 'border-blue-200 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-blue-200'
                          }`}
                          onClick={() => handleDocumentToggle(document.type)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-center group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                              <FileText className="w-5 h-5 text-dark" />
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedDocuments.includes(document.type) 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200'
                            }`}>
                              {selectedDocuments.includes(document.type) && (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 leading-tight">
                            {document.name}
                          </h4>
                        </div>
                      ))}
                    </div>
                    {selectedDocuments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-white rounded-xl p-4 border border-blue-200">
                          <p className="text-sm text-blue-700 font-semibold flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {userDocuments
                              .filter(doc => selectedDocuments.includes(doc.type))
                              .map(doc => doc.name)
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedDocuments.length === 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                          <p className="text-sm text-yellow-700 font-semibold flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            All available data will be shared
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            No specific documents selected - full profile data will be shared
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Documents Available</h3>
                  <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                    You need to upload documents to your profile before you can share them with others.
                  </p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Documents
                  </button>
                </div>
              )}
            </div>

            {/* Share Button */}
            <div className="text-center">
              <button
                onClick={handleShareData}
                disabled={isLoading || !friendEmail}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Send Sharing Request
                  </>
                )}
              </button>
              {!friendEmail && (
                <p className="text-sm text-amber-600 mt-3 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Please enter an email address to send request
                </p>
              )}
            </div>
          </div>

          {loadingData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your sharing data...</p>
            </div>
          ) : (
            <>
              {/* Requests Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Received Requests */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-200 to-green-300 rounded-lg flex items-center justify-center mr-2">
                      <Inbox className="w-4 h-4 text-dark" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 flex-1">Received Data</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {sharesData.received_shares?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {sharesData.received_shares && sharesData.received_shares.length > 0 ? (
                      sharesData.received_shares.map((request) => (
                        <div key={request.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md hover:border-green-200 transition-all duration-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">{request.sender_email}</span>
                              <span className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(request.created_at)}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          
                          {/* Action buttons for pending requests */}
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRequestAction(request.id, 'accept')}
                                className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRequestAction(request.id, 'decline')}
                                className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center"
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Inbox className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">No received Data</p>
                        <p className="text-xs text-gray-500">You'll see sharing requests from others here</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sent Requests */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg flex items-center justify-center mr-2">
                      <Send className="w-4 h-4 text-dark" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 flex-1">Sent Data</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {sharesData.sent_shares?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {sharesData.sent_shares && sharesData.sent_shares.length > 0 ? (
                      sharesData.sent_shares.map((request) => (
                        <div key={request.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">{request.receiver_email}</span>
                              <span className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(request.created_at)}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              request.status === 'declined' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          {request.status === 'accepted' && (
                            <button 
                              onClick={() => handleStopSharing(request.receiver_email)}
                              className="w-full px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Stop Sharing
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Send className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">No sent Data</p>
                        <p className="text-xs text-gray-500">Share documents with others to see data here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-dark" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex-1">Recent Activities</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    {notifications.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex justify-between items-start py-3 px-3 border border-gray-100 rounded-lg hover:shadow-md hover:border-purple-200 transition-all duration-200">
                        <div className="flex items-start flex-1">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg flex items-center justify-center mr-2 mt-0.5">
                            <FileText className="w-3 h-3 text-dark" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium">{activity.message}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex items-center whitespace-nowrap">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">No recent activities</p>
                      <p className="text-xs text-gray-500">Your sharing activities will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default DataSharing;
