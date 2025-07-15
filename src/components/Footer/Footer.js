import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-4">
              <img src={logo} alt="SabApplier AI Logo" className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-semibold">SabApplier AI</h3>
            </div>
            <p className="text-gray-400 max-w-xs">
              Streamlining job applications with AI-powered automation and smart tracking.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2">
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 4L12 14.01l-3-3" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} SabApplier AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 