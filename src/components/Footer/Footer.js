import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.jpeg';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src={logo} alt="SabApplier AI Logo" />
          <p>Sabapplier AI</p>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/privacy_policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <ul>
              <li>sabapplierai100m@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SabApplier AI. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer; 