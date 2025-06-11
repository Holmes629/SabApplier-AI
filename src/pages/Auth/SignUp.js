import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './SignUp.css';
import logo from '../../logo.jpeg';
import Footer from '../../components/Footer/Footer';
import { api } from '../../services/api';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
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
      await api.verifyOtp(formData.email, formData.otp);
      await api.signup(formData);
      localStorage.setItem("signupData", JSON.stringify({ email: formData.email }));
      
      // Show success message
      const messageElement = document.createElement('div');
      messageElement.textContent = 'Registered successfully! Redirecting...';
      messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => {
        document.body.removeChild(messageElement);
        navigate('/signup-page2');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="SabApplier AI" />
            </div>
            <h1>Join Us</h1>
            <p>Sign up to get started with SabApplier AI</p>
          </div>

          <form onSubmit={handleSignUp} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={otpSent}
                />
                <button
                  type="button"
                  className="verify-button"
                  onClick={handleVerifyEmail}
                  disabled={loading || otpSent}
                >
                  {loading ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  placeholder="Enter OTP sent to your email"
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  OTP expires in 5 minutes
                </small>
                <button 
                  type="button" 
                  className="resend-button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  style={{ 
                    marginTop: '10px', 
                    background: 'transparent', 
                    color: '#4a90e2', 
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Resend OTP
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ display: 'flex' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="show-hide-button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ display: 'flex' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="show-hide-button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="submit-button-login"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
            <div className="privacy-policy">
              <Link to="/privacy_policy">Our Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;