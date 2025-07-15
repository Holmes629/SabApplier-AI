import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { api } from '../../services/api';
import { User, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleProfileData, setGoogleProfileData] = useState(null);

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
                {userData.fullName || userData.fullname || googleProfileData?.name || 'User Name'}
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
                Full Name
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {userData.fullName || userData.fullname || 'Not provided'}
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

        {/* Referral Program Section (migrated from Referral.js) */}
        {userData.referral_code && (
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-lg p-8 w-full max-w-xl flex flex-col items-center mx-auto mb-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Referral Program</h2>
            <p className="text-blue-700 mb-6 text-center max-w-lg">
              Invite friends to unlock advanced features! Share your referral code below. Each friend who signs up with your code counts as a successful referral.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-800">Your Referral Code:</span>
                <span className="bg-white border border-blue-200 rounded px-3 py-1 font-mono text-blue-900 select-all">{userData.referral_code}</span>
                <button
                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  onClick={() => navigator.clipboard.writeText(userData.referral_code)}
                  disabled={!userData.referral_code}
                  title="Copy referral code"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-800">Successful Referrals:</span>
                <span className="bg-white border border-blue-200 rounded px-3 py-1 font-mono text-blue-900">{userData.successful_referrals ?? 0}</span>
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const response = await api.getProfile();
                      setUserData(response.user_data);
                    } catch (e) {
                      setError('Failed to refresh referral count.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  title="Refresh referral count"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75"/></svg>
                  ) : (
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 1021 12.35"/></svg>
                  )}
                  Refresh
                </button>
              </div>
            </div>
            {/* Share Buttons */}
            <div className="flex flex-wrap gap-4 mt-6 mb-2 justify-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join me on SabApplier AI and unlock advanced features!\n\nMY REFERRAL CODE: *** ${userData.referral_code.toUpperCase()} ***\n\nSign up here: https://sabapplier.com/signup`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12 12 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.97 11.97 0 0 0 12 24c6.63 0 12-5.37 12-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557zM12 22c-1.7 0-3.37-.34-4.93-1.01l-.35-.15-3.69.97.99-3.59-.18-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.34.99 2.63 1.13 2.81.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
                Share on WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on SabApplier AI and unlock advanced features!\n\nMY REFERRAL CODE: *** ${userData.referral_code.toUpperCase()} ***\n\nSign up here: https://sabapplier.com/signup`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.386.104-.793.16-1.213.16-.297 0-.583-.028-.862-.08.584 1.822 2.28 3.15 4.29 3.187A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
                Share on Twitter
              </a>
              <button
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                onClick={() => navigator.clipboard.writeText(`Join me on SabApplier AI and unlock advanced features!\n\nMY REFERRAL CODE: *** ${userData.referral_code.toUpperCase()} ***\n\nSign up here: https://sabapplier.com/signup`)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.371 0 0 5.371 0 12c0 6.629 5.371 12 12 12s12-5.371 12-12c0-6.629-5.371-12-12-12zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm1-17h-2v6H7v2h4v6h2v-6h4v-2h-4z"/></svg>
                Copy Message (Instagram/Other)
              </button>
            </div>
            <div className="mt-4 w-full flex flex-col items-center">
              {userData.successful_referrals >= 2 ? (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-xl text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Advanced features unlocked! Thank you for inviting friends.
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  {`Invite ${2 - (userData.successful_referrals ?? 0)} more friend${(2 - (userData.successful_referrals ?? 0)) === 1 ? '' : 's'} to unlock advanced features!`}
                </div>
              )}
            </div>
          </div>
        )}
        {/* End Referral Program Section */}

        {/* Footer */}
      </main>
      
      <Footer />
    </div>
  );
}

export default Profile;