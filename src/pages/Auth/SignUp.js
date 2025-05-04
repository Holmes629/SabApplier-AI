import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    dateofbirth: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });
  const [files, setFiles] = useState({
    passportSizePhoto: null,
    aadhaar: null,
    pan: null,
    signature: null,
    _10thCertificate: null,
    _12thCertificate: null,
    graduationCertificate: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: files[0]
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
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
    if (!files.passportSizePhoto || !files.aadhaar || !files.pan || !files.signature || !files._10thCertificate || !files._12thCertificate || !files.graduationCertificate) {
      setError('Please upload all required documents');
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
    setError('');

    try {
      const result = await onSignUp({
        fullname: formData.fullname,
        email: formData.email,
        dateofbirth: formData.dateofbirth,
        password: formData.password,
        phone_number: formData.phone,
        passport_size_photo: files.passportSizePhoto,
        aadhaar_card: files.aadhaar,
        pan_card: files.pan,
        signature: files.signature,
        _10th_certificate: files._10thCertificate,
        _12th_certificate: files._12thCertificate,
        graduation_certificate: files.graduationCertificate,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your fullname (as per Aadhaar)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateofbirth">Date of Birth</label>
            <input
              type="date"
              id="dateofbirth"
              name="dateofbirth"
              value={formData.dateofbirth}
              onChange={handleChange}
              placeholder="Enter your Date of Birth"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              maxLength="10"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passportSizePhoto">Passport Size Photo</label>
            <input
              type="file"
              id="passportSizePhoto"
              name="passportSizePhoto"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="aadhaar">Aadhaar Card</label>
            <input
              type="file"
              id="aadhaar"
              name="aadhaar"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pan">PAN Card</label>
            <input
              type="file"
              id="pan"
              name="pan"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signature">Signature</label>
            <input
              type="file"
              id="signature"
              name="signature"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="_10thCertificate">10th Certificate</label>
            <input
              type="file"
              id="_10thCertificate"
              name="_10thCertificate"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="_12thCertificate">12th Certificate</label>
            <input
              type="file"
              id="_12thCertificate"
              name="_12thCertificate"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="graduationCertificate">Graduation Certificate</label>
            <input
              type="file"
              id="graduationCertificate"
              name="graduationCertificate"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter your state"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter your pincode"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp; 