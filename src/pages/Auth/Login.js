import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../../logo.jpeg";

import { api } from "../../services/api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
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
      const result = await onLogin(formData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      console.log("Google credential response:", credentialResponse);
      const result = await api.googleSignup(credentialResponse.credential);
      console.log("Google signup result:", result);

      if (result.success) {
        // Store Google data for use in profile completion
        if (result.googleData) {
          localStorage.setItem("googleData", JSON.stringify(result.googleData));
        }

        // Check if user needs to complete profile
        if (result.needsProfileCompletion) {
          // Store the user data and navigate to SignUpStep2
          const userData = result.user || { email: result.email };
          localStorage.setItem("currentUser", JSON.stringify(userData));
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("isSignUp2", "false");
          navigate("/signup-page2");
        } else {
          // User already has complete profile, log them in
          const loginResult = await onLogin({
            email: result.user?.email || result.email,
            isGoogleLogin: true,
            userData: result.user,
            googleData: result.googleData,
          });

          if (loginResult.success) {
            navigate("/");
          } else {
            setError("Login failed after Google authentication.");
          }
        }
      } else {
        setError(result.message || "Google signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError(`Google signup failed: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google signup was cancelled or failed.");
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-6 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-12 -translate-y-12"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <img src={logo} alt="SabApplier AI" className="w-12 h-12 object-contain" />
                </div>
                
                {/* Welcome Text */}
                <h1 className="text-xl font-bold text-white mb-1">Welcome Back!</h1>
                <p className="text-blue-100 text-xs">Sign in to continue your smart application journey</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 text-xs">{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 font-medium">or continue with</span>
                  </div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  <div className="w-full max-w-xs transform scale-90">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="medium"
                      text="signin_with"
                      shape="rectangular"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Section */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center space-y-3">
              <p className="text-gray-600 text-xs">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
              
              <div className="pt-2 border-t border-gray-200 space-y-1">
                <div>
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-xs text-gray-600 hover:text-blue-600 hover:underline transition-colors font-medium"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Return to Home
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/privacy_policy" 
                    className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                  >
                    Privacy Policy & Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="text-gray-600">
              <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Secure Login</p>
            </div>
            
            <div className="text-gray-600">
              <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">24/7 Support</p>
            </div>
            
            <div className="text-gray-600">
              <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">AI Powered</p>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default Login;
