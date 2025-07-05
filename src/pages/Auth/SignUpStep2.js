import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../logo.jpeg";
import { useAuth } from "../../hooks/useAuth";

const SignUpStep2 = () => {
  const navigate = useNavigate();
  const { completeProfile, user } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    dateofbirth: "",
    address: "",
    phone_number: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState([]);

  // Auto-fill form with Google data and user data if available
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const googleData = localStorage.getItem("googleData");
    
    // Start with empty form data
    let newFormData = {
      fullname: "",
      dateofbirth: "",
      address: "",
      phone_number: ""
    };
    let filledFields = [];
    
    // First apply Google data if available
    if (googleData) {
      try {
        const gData = JSON.parse(googleData);
        console.log('Found Google data:', gData);
        
        // Map Google data to form fields
        if (gData.name) {
          newFormData.fullname = gData.name;
          filledFields.push('fullname');
          console.log('Auto-filled fullname from Google:', gData.name);
        }
        
        // You could potentially extract more info from Google in the future
        // For example, if Google provided location data, you could use it for address
        
      } catch (error) {
        console.error('Error parsing Google data:', error);
      }
    }
    
    // Then apply saved user data (this will override Google data if user data exists)
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Found saved user data:', user);
        
        // Apply user data, keeping existing values if they're already set
        if (user.fullName || user.fullname) {
          newFormData.fullname = user.fullName || user.fullname || newFormData.fullname;
          if (!filledFields.includes('fullname')) {
            filledFields.push('fullname');
          }
        }
        if (user.dateofbirth) {
          newFormData.dateofbirth = user.dateofbirth || newFormData.dateofbirth;
          filledFields.push('dateofbirth');
        }
        if (user.correspondenceAddress || user.address) {
          newFormData.address = user.correspondenceAddress || user.address || newFormData.address;
          filledFields.push('address');
        }
        if (user.phone_number) {
          newFormData.phone_number = user.phone_number || newFormData.phone_number;
          filledFields.push('phone_number');
        }
      } catch (error) {
        console.error('Error parsing current user data:', error);
      }
    }
    
    // Update form data and auto-filled fields if there were any changes
    setFormData(newFormData);
    setAutoFilledFields(filledFields);
    
    // Show a message if any fields were auto-filled
    if (filledFields.length > 0) {
      const messageElement = document.createElement('div');
      messageElement.textContent = `Auto-filled ${filledFields.length} field(s) from your account data`;
      messageElement.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      document.body.appendChild(messageElement);
      setTimeout(() => {
        if (document.body.contains(messageElement)) {
          document.body.removeChild(messageElement);
        }
      }, 3000);
    }
    
    // Clean up Google data from localStorage after using it
    if (googleData) {
      localStorage.removeItem("googleData");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.fullname ||
      !formData.dateofbirth ||
      !formData.address ||
      !formData.phone_number
    ) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Get email from user context or localStorage
      let email = user?.email;
      
      if (!email) {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          email = userData.email;
        }
      }

      // If email is still not found, try to get it from the signup data
      if (!email) {
        const signupData = localStorage.getItem("signupData");
        if (signupData) {
          const data = JSON.parse(signupData);
          email = data.email;
        }
      }

      if (!email) {
        setError("Email not found. Please complete the signup process from the beginning.");
        setLoading(false);
        return;
      }

      const result = await completeProfile({
        ...formData,
        email, // include email in payload
      });
      
      if (result.success) {
        console.log("Profile update successful:", { ...formData, email });
        // Clear the signup data from localStorage
        localStorage.removeItem("signupData");
        localStorage.removeItem("googleData");
        
        // Show success message
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Profile completed successfully!';
        messageElement.style.cssText = 'position: fixed; top: 70px; right: 50%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 1000);
        
        // Navigate to home
        navigate("/", { replace: true });
      } else {
        setError(result.message || "Profile update failed.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-3 relative z-10">
        <div className="w-full max-w-lg">
          {/* Profile Completion Card */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-4 py-3 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full transform -translate-x-4 translate-y-4"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <img src={logo} alt="SabApplier AI" className="w-8 h-8 object-contain" />
                </div>
                
                {/* Welcome Text */}
                <h1 className="text-lg font-bold text-white mb-1">Complete Your Profile</h1>
                <p className="text-blue-100 text-xs">Final step to get started</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Profile Setup</span>
                <span className="text-xs font-medium text-blue-600">Step 2 of 2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Account Created</span>
                <span className="text-blue-600 font-medium">Profile Details</span>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-4 py-3">
              {/* Auto-fill Information Banner */}
              {autoFilledFields.length > 0 && (
                <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-blue-800 text-xs font-medium">
                        Great! We've auto-filled some fields with your account information.
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        Please review and update any information as needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center space-x-2">
                  <svg className="w-3 h-3 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-xs">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-2">
                
                {/* Full Name Field */}
                <div className="space-y-1">
                  <label htmlFor="fullname" className="block text-xs font-semibold text-gray-700">
                    Full Name
                    {autoFilledFields.includes('fullname') && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Auto-filled
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm ${
                        autoFilledFields.includes('fullname') 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      {autoFilledFields.includes('fullname') ? (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div className="space-y-1">
                  <label htmlFor="dateofbirth" className="block text-xs font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dateofbirth"
                      name="dateofbirth"
                      value={formData.dateofbirth}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Address Field */}
                <div className="space-y-1">
                  <label htmlFor="address" className="block text-xs font-semibold text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter your complete address"
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none text-sm"
                    />
                    <div className="absolute top-2 right-0 pr-2 flex items-start pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1">
                  <label htmlFor="phone_number" className="block text-xs font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Don't include country code</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Setting up profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Complete Setup</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Section */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Quick Setup</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Your information is encrypted and secure.
                </p>
                
                {/* Return to Home Link */}
                <div className="pt-1 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Return to Home</span>
                  </button>
                  <span className="text-gray-300">•</span>
                  <Link
                    to="/privacy-policy"
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpStep2;