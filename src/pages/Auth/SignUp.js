import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Users } from 'lucide-react';
import logo from '../../logo.jpeg';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    referred_by: '', // Added referred_by to formData
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleVerifyEmail = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.sendOtp(formData.email);
      setOtpSent(true);
      
      // Show success message
      const messageElement = document.createElement('div');
      messageElement.textContent = 'OTP sent to your email!';
      messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.sendOtp(formData.email);
      
      // Show success message
      const messageElement = document.createElement('div');
      messageElement.textContent = 'OTP resent to your email!';
      messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      setError('Please verify your email first');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Verify OTP first
      await api.verifyOtp(formData.email, formData.otp);
      
      // Then signup using AuthContext
      const result = await signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referred_by: formData.referred_by,
      });
      
      if (result.success) {
        // Show success message
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Registered successfully! Please complete your profile...';
        messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
        document.body.appendChild(messageElement);
        setTimeout(() => {
          document.body.removeChild(messageElement);
          navigate('/signup-page2');
        }, 2000);
      } else {
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* SignUp Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-5 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-6 translate-y-6"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <img src={logo} alt="SabApplier AI" className="w-12 h-12 object-contain" />
                </div>
                
                {/* Welcome Text */}
                <h1 className="text-xl font-bold text-white mb-1">Join SabApplier AI</h1>
                <p className="text-blue-100 text-xs">Create your account and start applying smarter</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-6 py-5">
              <form onSubmit={handleSignUp} className="space-y-3">
                
                {/* Email Field with OTP */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        disabled={otpSent}
                        className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm ${
                          otpSent ? 'bg-green-50 border-green-200' : ''
                        }`}
                      />
                      {otpSent && (
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={loading || otpSent}
                      className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                        otpSent 
                          ? 'bg-green-500 text-white cursor-default' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : otpSent ? (
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Sent</span>
                        </div>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </div>
                </div>

                {/* OTP Field */}
                {otpSent && (
                  <div className="space-y-1 animate-fade-in">
                    <label htmlFor="otp" className="block text-xs font-semibold text-gray-700">
                      Verification Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 tracking-widest text-center font-mono text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">⏱️ Expires in 5 min</span>
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors disabled:opacity-50"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a strong password"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Min 8 characters</span>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className={`text-xs flex items-center space-x-1 ${
                      formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center space-x-2">
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
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Create Account</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
                <div className="flex items-center justify-center mt-2 text-blue-500 text-sm gap-2 opacity-80">
                  <Users className="w-4 h-4" />
                  <span>Join thousands who trust SabApplier AI for secure, one-click form filling.</span>
                </div>
              </form>
            </div>

            {/* Footer Section */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center space-y-3">
              <p className="text-gray-600 text-xs">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Sign in here
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
                    to="/privacy-policy" 
                    className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                  >
                    Privacy Policy & Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="text-gray-600">
              <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Email Verified</p>
            </div>
            
            <div className="text-gray-600">
              <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Secure Data</p>
            </div>
            
            <div className="text-gray-600">
              <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">AI Ready</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SignUp;