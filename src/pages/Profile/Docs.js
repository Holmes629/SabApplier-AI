import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Footer from '../../components/Footer/Footer';
import { Download, Trash2, Upload, FileText, CheckCircle } from 'lucide-react'; 

const DOCUMENT_FIELDS = {
  passport_size_photo_file_url: 'Passport Size Photo',
  aadhaar_card_file_url: 'Aadhaar Card',
  pan_card_file_url: 'PAN Card',
  signature_file_url: 'Signature',
  _10th_certificate_file_url: '10th Certificate',
  _12th_certificate_file_url: '12th Certificate',
  graduation_certificate_file_url: 'Graduation Certificate',
  left_thumb_file_url: 'Left Thumb',
  caste_certificate_file_url: 'Caste Certificate',
  pwd_certificate_file_url: 'PWD Certificate',
  domicile_certificate_file_url: 'Domicile Certificate',
};

const Docs = ({ docUpload }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [customDocType, setCustomDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isProfileFetched, setIsProfileFetched] = useState(
    localStorage.getItem("isProfileFetched") === "true"
  );

  useEffect(() => {
    if (!isProfileFetched) {
      getProfile();
    } else {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserData(user);
        setFormData(user);
      }
    }
  }, [isProfileFetched]);

  const getProfile = async () => {
    try {
      const response = await api.getProfile();
      setUserData(response.user_data);
      setFormData(response.user_data);

      setIsProfileFetched(true);
      localStorage.setItem("isProfileFetched", "true");
      localStorage.setItem("currentUser", JSON.stringify(response.user_data));
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const getDropboxDownloadLink = (url) => {
    if (!url) return '';
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('&dl=0', '&dl=1'); 
  };

  const handleFileUpload = async (fileFieldName, file) => {
    setUploading(true);
    try {
      await docUpload({ [fileFieldName]: file });
      setTimeout(() => {
        getProfile();
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (field) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete({ field });
      if (response.success) {
        setUserData((prev) => ({ ...prev, [field]: null }));
        setFormData((prev) => ({ ...prev, [field]: null }));
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Something went wrong while deleting the document, try again...");
    }
  };

  const uploadedCount = Object.entries(DOCUMENT_FIELDS).filter(([field]) => userData?.[field]).length;
  const totalCount = Object.entries(DOCUMENT_FIELDS).length;

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-30 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700 mb-6">
            <FileText className="w-4 h-4 mr-2" />
            Document Management
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            My <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Documents</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Manage and organize all your important documents in one secure place
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Documents uploaded</span>
              <span>{uploadedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Upload New Document
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                value={formData.docType || ''}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
              >
                <option value="">Select Document Type</option>
                {Object.entries(DOCUMENT_FIELDS).map(([key, label]) => (
                  <option key={key} value={key.replace('_file_url', '')}>
                    {label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Or enter custom document name"
                value={customDocType}
                onChange={(e) => setCustomDocType(e.target.value)}
                onBlur={() => {
                  if (customDocType.trim()) {
                    const formattedKey = customDocType
                      .toLowerCase()
                      .replace(/\s+/g, '_') + '_file_url';

                    if (!DOCUMENT_FIELDS[formattedKey]) {
                      setFormData({
                        ...formData,
                        docType: customDocType.toLowerCase().replace(/\s+/g, '_'),
                      });
                    }
                  }
                }}
              />

              <label className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                formData.docType 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const docType = formData.docType;
                    if (file && docType) {
                      handleFileUpload(`${docType}_file_url`, file);
                    }
                  }}
                  disabled={!formData.docType || uploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Uploaded Documents</h3>
          
          {uploadedCount === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents uploaded yet</h3>
              <p className="text-gray-600">Start by uploading your first document using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(DOCUMENT_FIELDS).map(([field, label]) =>
                userData[field] ? (
                  <div key={field} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{label}</h4>
                      </div>
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={userData[field]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200 text-center"
                      >
                        View
                      </a>
                      <a
                        href={getDropboxDownloadLink(userData[field])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button 
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        onClick={() => handleDeleteDoc(field)} 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Docs;