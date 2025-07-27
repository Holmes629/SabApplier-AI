import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { api } from '../../services/api';
import { User, Mail, Phone, MapPin, Calendar, X, Trash2, AlertTriangle } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleProfileData, setGoogleProfileData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
          throw new Error("Please log in to view your profile");
        }

        // Check for Google profile data from localStorage (for temporary use)
        const googleData = localStorage.getItem("googleData");
        if (googleData) {
          try {
            const parsedGoogleData = JSON.parse(googleData);
            setGoogleProfileData(parsedGoogleData);
            console.log('Found Google profile data:', parsedGoogleData);
          } catch (error) {
            console.error('Error parsing Google data:', error);
          }
        }

        const response = await api.getProfile();
        setUserData(response.user_data);
        
        // If user has Google profile picture stored in backend, prioritize that
        if (response.user_data.google_profile_picture) {
          console.log('Using Google profile picture from backend:', response.user_data.google_profile_picture);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'Failed to load profile. Please try again.');
        
        if (err.message.includes("log in")) {
          setTimeout(() => {
            localStorage.removeItem("currentUser");
            navigate('/login');
          }, 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Call the delete account API
      const result = await api.deleteAccount();
      
      if (result.success) {
        // Show success message
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Account deleted successfully. We\'re sorry to see you go!';
        messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 12px 20px; background: #10B981; color: white; border-radius: 8px; z-index: 1000; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        document.body.appendChild(messageElement);
        
        // Clear all local storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Close modal
        setShowDeleteModal(false);
        
        // Redirect to intro page after a short delay
        setTimeout(() => {
          window.location.href = '/intro';
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Delete account error:', err);
      
      // Show error message
      const messageElement = document.createElement('div');
      messageElement.textContent = `Error: ${err.message}`;
      messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 12px 20px; background: #EF4444; color: white; border-radius: 8px; z-index: 1000; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
      document.body.appendChild(messageElement);
      
      setTimeout(() => {
        if (document.body.contains(messageElement)) {
          document.body.removeChild(messageElement);
        }
      }, 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Data</h3>
          <p className="text-gray-600 mb-6">Unable to load profile data. Please try logging in again.</p>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              localStorage.removeItem("isProfileFetched");
              window.location.href = '/login';
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-30"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700 mb-6">
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            My <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl p-8 mb-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative">
              {(userData?.google_profile_picture || googleProfileData?.picture) ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={userData?.google_profile_picture || googleProfileData?.picture} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default avatar if Google image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full hidden items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              {(userData?.google_profile_picture || googleProfileData?.picture) && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {(userData.first_name || '') +
                 (userData.middle_name ? ' ' + userData.middle_name : '') +
                 (userData.last_name ? ' ' + userData.last_name : '') ||
                 userData.fullName || userData.fullname || googleProfileData?.name || 'User Name'}
              </h2>
              <p className="text-gray-600 mb-2">{userData.email}</p>
              {(userData?.google_profile_picture || googleProfileData) && (
                <div className="inline-flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full text-sm text-green-700 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Signed in with Google
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Name
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {(userData.first_name || '') +
                 (userData.middle_name ? ' ' + userData.middle_name : '') +
                 (userData.last_name ? ' ' + userData.last_name : '') ||
                 userData.fullName || userData.fullname || 'Not provided'}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                Email Address
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {userData.email}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Phone Number
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {userData.phone_number || 'Not provided'}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                Date of Birth
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {userData.dateofbirth || 'Not provided'}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Address
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {userData.correspondenceAddress || userData.address || 'Not provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
          </div>
          <p className="text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </button>
        </div>

        {/* Footer */}
      </main>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your account? This will permanently remove:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All your personal information</li>
                <li>• Your profile data and documents</li>
                <li>• Your application history</li>
                <li>• All shared data connections</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default Profile;