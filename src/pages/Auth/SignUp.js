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
    setLoading(true);
    try {
      await api.sendOtp(formData.email); // This should also check if email already exists
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.verifyOtp(formData.email, formData.otp);
      await api.signup(formData);
      alert('Registered successfully! You can now log in.');
      navigate('/signup-page2');
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
                />
                <button
                  type="button"
                  className="verify-button"
                  onClick={handleVerifyEmail}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                  
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
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
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
