import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
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
                  to="/privacy_policy" 
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
              <a 
                href="mailto:sabapplierai100m@gmail.com" 
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                sabapplierai100m@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} SabApplier AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 