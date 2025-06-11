import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import logo from '../../logo.jpeg';
import { api } from '../../services/api';
import './ForgotPassword.css';

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
  const [otpSent, setOtpSent] = useState(false);
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

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.sendForgotPasswordOtp(formData.email);
      setOtpSent(true);
      setStep(2);
      
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
      
      // Show success message
      const messageElement = document.createElement('div');
      messageElement.textContent = 'Password reset successfully!';
      messageElement.style.cssText = 'position: fixed; top: 70px; left: 50%; transform: translateX(-50%); padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => {
        document.body.removeChild(messageElement);
        navigate('/login');
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
          <div className="auth-logo">
            <img src={logo} alt="SabApplier AI" />
          </div>
          <h2>
            {step === 1 ? 'Reset Your Password' : 'Verify OTP & Set New Password'}
          </h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={step === 2}
                />
                {step === 1 && (
                  <button
                    type="button"
                    className="verify-button"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="otp">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter OTP sent to your email"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '0.8rem' }}>
                    OTP expires in 5 minutes
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <div style={{ display: "flex" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className='show-hide-button'
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div style={{ display: "flex" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className='show-hide-button'
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            )}

            {step === 2 && (
              <button 
                type="button" 
                className="resend-button"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ 
                  marginTop: '10px', 
                  background: 'transparent', 
                  color: '#4a90e2', 
                  border: 'none',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Resend OTP
              </button>
            )}
          </form>

          <p className="auth-link">
            <p>Remember your password? <Link to="/login">Sign in</Link></p>
            
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword; 