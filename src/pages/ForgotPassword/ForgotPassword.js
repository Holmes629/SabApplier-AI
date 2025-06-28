import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import logo from '../../logo.jpeg';
import { api } from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + Password

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const showSuccessMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce';
    document.body.appendChild(messageElement);
    setTimeout(() => {
      if (document.body.contains(messageElement)) {
        document.body.removeChild(messageElement);
      }
    }, 3000);
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.sendForgotPasswordOtp(formData.email);
      setStep(2);
      showSuccessMessage('OTP sent to your email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.otp) {
      setError('OTP is required');
      return false;
    }
    if (!formData.password || !formData.confirmPassword) {
      setError('Password and confirm password are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      await handleSendOtp();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.resetPassword(formData.email, formData.otp, formData.password);
      
      showSuccessMessage('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Reset Password Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-blue-600 px-8 py-10 text-center relative overflow-hidden">
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <img src={logo} alt="SabApplier AI" className="w-16 h-16 object-contain" />
                </div>
                
                {/* Title Text */}
                <h1 className="text-2xl font-bold text-white mb-2">
                  {step === 1 ? 'Reset Your Password' : 'Verify & Reset'}
                </h1>
                <p className="text-blue-100 text-sm">
                  {step === 1 
                    ? 'Enter your email to receive reset instructions' 
                    : 'Enter the OTP and your new password'
                  }
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      disabled={step === 2}
                      className={`w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        step === 2 ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    {step === 1 && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                          {loading ? 'Sending...' : 'Send OTP'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {step === 2 && (
                  <>
                    {/* OTP Field */}
                    <div className="space-y-2">
                      <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                        Verification Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleChange}
                          placeholder="Enter 6-digit OTP"
                          required
                          className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-center text-lg tracking-widest"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Shield className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        OTP expires in 5 minutes
                      </p>
                    </div>

                    {/* New Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          required
                          className="w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your new password"
                          required
                          className="w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                {step === 2 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-lg focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Reset Password</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                )}

                {/* Resend OTP Button */}
                {step === 2 && (
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 hover:underline transition-colors disabled:opacity-50"
                  >
                    Didn't receive the code? Resend OTP
                  </button>
                )}
              </form>
            </div>

            {/* Footer Section */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center space-y-4">
              <p className="text-gray-600">
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
              
              <div className="pt-2 border-t border-gray-200">
                <Link 
                  to="/privacy-policy" 
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                >
                  Privacy Policy & Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-gray-600">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Secure Reset</p>
            </div>
            
            <div className="text-gray-600">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Quick Recovery</p>
            </div>
            
            <div className="text-gray-600">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
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

export default ForgotPassword; 