import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUpStep2 = ({ onSignUp2 }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dateofbirth: '',
    address: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.dateofbirth || !formData.address || !formData.phone_number) {
      setError('All fields are required');
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
      const result = await onSignUp2({
        fullName: formData.fullName,
        dateofbirth: formData.dateofbirth,
        address: formData.address,
        phone_number: formData.phone_number
      });
      if (result.success) {
        navigate('/manage-docs');
      } else {
        setError(result.message || 'Profile update failed.');
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Complete Your Profile</h2>
        {/* Status bar (progress bar) for step 2 of 3 */}
        <div style={{ marginBottom: '1rem', height: '4px', background: '#eee', borderRadius: '2px' }}>
          <div style={{ width: '66%', height: '100%', background: '#4CAF50', borderRadius: '2px' }} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
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
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpStep2; 