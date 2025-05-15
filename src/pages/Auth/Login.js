import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../logo.jpeg';
import Footer from '../../components/Footer/Footer';
import image1 from './images/image1.jpeg';
import image2 from './images/image2.jpeg';
import image3 from './images/image3.jpeg';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample images for the carousel - replace these with your actual images
  const carouselImages = [
    image1,
    image2,
    image3,
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
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
      const result = await onLogin(formData);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="intro">
        <h1>Sabapplier AI - Smart Form Filler & Document Manager</h1>
        <div className="carousel-container">
          <button className="carousel-arrow left" onClick={prevImage}>
            &#10094;
          </button>
          <div className="carousel-images">
            {carouselImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${-100 * currentImageIndex}%)`
                }}
              />
            ))}
          </div>
          <button className="carousel-arrow right" onClick={nextImage}>
            &#10095;
          </button>
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="middle-intro">
          <h1>
            "We make lifes easier by helping users automatically fill out web forms using saved profile data and docs submitted. Our AI-powered auto filler will be one stop for all your applications and doc management." 
          </h1>
      </div>
      <div className="auth-container">
        <div className="side-intro">
          <h1>AI-powered extension to fill complex forms, manage documents and auto-edit photos for exam and offical applications."</h1>
          <p>get our <a href="#google-chrom-link">extension here</a></p>
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="SabApplier AI" />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to SabApplier AI</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
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
                required
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            <div className='privacy-policy'>
              <Link to="/privacy_policy"> Our Privacy Policy </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login; 