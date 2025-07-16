import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { api } from '../../services/api';
import { Share2, Send, Inbox, Clock, CheckCircle2, AlertCircle, FileText, ChevronDown, Download, Lock, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

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

// Helper to get Dropbox direct download link
const getDropboxDownloadLink = (url) => {
  if (!url) return '';
  return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('&dl=0', '&dl=1');
};

function DataSharing() {
  const { user, updateUser } = useAuth();
  const [freshUser, setFreshUser] = useState(user);
  const [loadingUser, setLoadingUser] = useState(true);
  const advancedUnlocked = freshUser?.successful_referrals >= 2;
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
  const [sharingType, setSharingType] = useState('documents_only'); // 'documents_only' or 'documents_with_details'
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Always fetch the latest user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const response = await api.getProfile();
        if (response && response.user_data) {
          setFreshUser(response.user_data);
          // updateUser removed here to prevent reload loop
        }
      } catch (e) {
        // fallback to context user
        setFreshUser(user);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

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

  const prettifyFieldName = (field) => {
    return field.replace(/_file_url$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const loadUserDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await api.getProfile();
      const documents = [];
      if (response.user_data) {
        // Use all_documents for all uploaded docs
        const allDocs = response.user_data.all_documents || {};
        const customDocCategories = response.user_data.custom_doc_categories || {};
        Object.entries(allDocs).forEach(([field, url]) => {
          if (url) {
            // Try to get label from DOCUMENT_FIELDS, else prettify
            let name = DOCUMENT_FIELDS[field] || prettifyFieldName(field);
            // Optionally, append category info for custom docs
            documents.push({
              name,
              type: field,
              url,
              category: customDocCategories[field] || null
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
      await api.shareDataWithFriend(friendEmail, selectedDocuments, sharingType);
      
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
      // Re-fetch user profile to update successful_referrals
      const response = await api.getProfile();
      if (response && response.user_data) {
        updateUser && updateUser(response.user_data);
      }
    } catch (error) {
      console.error('Error sharing data:', error);
      setErrorMessage('Failed to send sharing request: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (shareId, action) => {
    setActionLoadingId(`${shareId}-${action}`);
    try {
      await api.respondToShareRequest(shareId, action);
      setSuccessMessage(`Request ${action}ed successfully!`);
      // Reload the shares data to reflect the change
      await loadSharesData();
      await loadNotifications();
      // Re-fetch user profile to update successful_referrals
      const response = await api.getProfile();
      if (response && response.user_data) {
        updateUser && updateUser(response.user_data);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setErrorMessage(`Failed to ${action} request: ` + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStopSharing = async (receiverEmail, shareId) => {
    setActionLoadingId(`stop-${shareId}`);
    try {
      await api.stopDataSharing(receiverEmail);
      setSuccessMessage(`Stopped sharing with ${receiverEmail}`);
      await loadSharesData();
      // Re-fetch user profile to update successful_referrals
      const response = await api.getProfile();
      if (response && response.user_data) {
        updateUser && updateUser(response.user_data);
      }
    } catch (error) {
      console.error('Error stopping share:', error);
      setErrorMessage('Failed to stop sharing: ' + error.message);
    } finally {
      setActionLoadingId(null);
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

  // Add handler for marking notification as read
  const handleMarkAsRead = async (notificationId) => {
    console.log('[DEBUG] handleMarkAsRead called with notificationId:', notificationId);
    try {
      console.log('[DEBUG] Calling api.markNotificationAsRead with:', notificationId);
      await api.markNotificationAsRead(notificationId);
      setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, is_read: true } : n));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Before rendering, sort received_shares and sent_shares by status:
  const sortRequests = (requests) => {
    const statusOrder = { accepted: 0, pending: 1, stopped: 2, declined: 3 };
    return [...requests].sort((a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99));
  };
  const sortedReceivedShares = sortRequests(sharesData.received_shares || []);
  const sortedSentShares = sortRequests(sharesData.sent_shares || []);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  if (!advancedUnlocked) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-blue-50/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-lg p-8 w-full max-w-xl flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-6 h-6 text-yellow-500" />
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-blue-900 font-bold text-lg">Advanced Feature Locked</span>
          </div>
          <p className="text-blue-700 mb-4 text-center max-w-lg">
            
            Data Sharing and other advanced features are locked.<br />
            Invite 2 friends to unlock these features!
          </p>
          <a href="/profile" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Go to Profile to Unlock</a>
        </div>
      </div>
    );
  }

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

            {/* Sharing Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What do you want to share?
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sharingType"
                    value="documents_only"
                    checked={sharingType === 'documents_only'}
                    onChange={() => setSharingType('documents_only')}
                  />
                  Only share documents
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sharingType"
                    value="documents_with_details"
                    checked={sharingType === 'documents_with_details'}
                    onChange={() => setSharingType('documents_with_details')}
                  />
                  Share documents with details to fill forms
                </label>
              </div>
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
                <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 bg-gradient-to-r from-green-200 to-green-300 rounded-lg flex items-center justify-center mr-2">
                      <Inbox className="w-4 h-4 text-dark" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 flex-1">Received Data</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {sharesData.received_shares?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sortedReceivedShares && sortedReceivedShares.length > 0 ? (
                      sortedReceivedShares.map((request) => {
                        const sharedData = request.shared_data || {};
                        const documentsObj = sharedData.documents || {};
                        const documentUrls = documentsObj.document_urls || {};
                        const hasDocuments = Object.keys(documentUrls).length > 0;
                        return (
                          <div key={request.id} className="border border-gray-100 rounded-md p-2 hover:shadow-sm hover:border-green-200 transition-all duration-200 flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">{request.sender_email}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[70px] text-center ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                            {/* Show shared documents if present */}
                            {hasDocuments && request.status === 'accepted' && (
                              <div className="mt-1">
                                <div className="font-semibold text-xs text-gray-700 mb-0.5">Docs:</div>
                                <div className="relative inline-block w-full max-w-xs">
                                  <button
                                    type="button"
                                    className="w-full flex justify-between items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-700 font-medium focus:outline-none text-xs"
                                    onClick={() => setOpenDropdownId(openDropdownId === request.id ? null : request.id)}
                                  >
                                    View
                                    <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${openDropdownId === request.id ? 'rotate-180' : ''}`} />
                                  </button>
                                  {openDropdownId === request.id && (
                                    <div className="absolute left-0 right-0 mt-1 bg-white border border-blue-200 rounded shadow z-10">
                                      <ul className="py-1 max-h-40 overflow-y-auto">
                                        {Object.entries(documentUrls).map(([docType, url]) => (
                                          <li key={docType} className="flex items-center px-2 py-1 hover:bg-blue-50 text-xs">
                                            <a
                                              href={getDropboxDownloadLink(url)}
                                              download
                                              className="flex-1 text-blue-700 hover:underline truncate"
                                            >
                                              {DOCUMENT_FIELDS[docType] || docType}
                                            </a>
                                            <a href={getDropboxDownloadLink(url)} download className="ml-1 text-blue-600 hover:text-blue-800" title="Download">
                                              <Download className="w-3 h-3" />
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          {/* Action buttons for pending requests */}
                          {request.status === 'pending' && (
                              <div className="flex gap-1 mt-1">
                              <button
                                onClick={() => handleRequestAction(request.id, 'accept')}
                                  className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-semibold flex items-center justify-center min-w-[60px]"
                                  disabled={actionLoadingId === `${request.id}-accept` || actionLoadingId === `${request.id}-decline`}
                              >
                                  {actionLoadingId === `${request.id}-accept` ? (
                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                                  ) : <CheckCircle2 className="w-3 h-3 mr-1" />}
                                Accept
                              </button>
                              <button
                                onClick={() => handleRequestAction(request.id, 'decline')}
                                  className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-semibold flex items-center justify-center min-w-[60px]"
                                  disabled={actionLoadingId === `${request.id}-accept` || actionLoadingId === `${request.id}-decline`}
                              >
                                  {actionLoadingId === `${request.id}-decline` ? (
                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                                  ) : <AlertCircle className="w-3 h-3 mr-1" />}
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-3 text-gray-500 text-xs">
                        <Inbox className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        <p>No received Data</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sent Requests */}
                <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg flex items-center justify-center mr-2">
                      <Send className="w-4 h-4 text-dark" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 flex-1">Sent Data</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {sharesData.sent_shares?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sortedSentShares && sortedSentShares.length > 0 ? (
                      sortedSentShares.map((request) => (
                        <div key={request.id} className="border border-gray-100 rounded-md p-2 hover:shadow-sm hover:border-blue-200 transition-all duration-200 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">{request.receiver_email}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold min-w-[70px] text-center ${
                              request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              request.status === 'declined' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          {request.status === 'accepted' && (
                            <button 
                              onClick={() => handleStopSharing(request.receiver_email, request.id)}
                              className="w-full px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-semibold flex items-center justify-center min-w-[60px] mt-1"
                              disabled={actionLoadingId === `stop-${request.id}`}
                            >
                              {actionLoadingId === `stop-${request.id}` ? (
                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                              ) : <AlertCircle className="w-3 h-3 mr-1" />}
                              Stop Sharing
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-3 text-gray-500 text-xs">
                        <Send className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        <p>No sent Data</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-blue-700" />
                  </div>
                  <h3 className="text-lg font-bold text-black flex-1">Recent Activities</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {notifications.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-center justify-between px-2 py-1 border border-gray-100 rounded hover:bg-purple-50 transition-all duration-150 ${activity.is_read ? 'opacity-60' : 'bg-white'}`}
                        style={{ fontSize: '12px', minHeight: '32px' }}
                      >
                        <div className="flex items-center flex-1 gap-2">
                          <FileText className="w-3 h-3 text-purple-400 flex-shrink-0" />
                          <span className="truncate flex-1">{activity.message}</span>
                        </div>
                        <span className="text-xs text-gray-400 ml-2 flex items-center whitespace-nowrap">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(activity.created_at)}
                        </span>
                        {!activity.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(activity.id)}
                            className="ml-2 px-2 py-0.5 text-xs text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition-all"
                            style={{ fontSize: '11px' }}
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-xs">
                      <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="font-medium">No recent activities</p>
                      <p>Your sharing activities will appear here</p>
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
