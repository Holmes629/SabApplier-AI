import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 backdrop-blur-sm sticky top-0 z-50 border-b border-blue-300/20 shadow-xl w-full">
      <div className="max-w-8xl mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200/40 group-hover:border-blue-300/60 transition-all duration-300">
                <img 
                  src="https://www.sabapplier.com/static/media/logo.fb1a6d9168a84438a23f.jpeg" 
                  alt="SabApplier AI" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div> */}
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-white tracking-tight">
                SabApplier 
                <span className="text-blue-300 ml-1 font-extrabold">AI</span>
              </span>
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button 
              onClick={() => scrollToSection('features')}
              className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button 
              onClick={() => scrollToSection('privacy')}
              className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-white/90 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-5 py-2.5 text-white border border-white/30 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:border-blue-300/50 hover:shadow-md backdrop-blur-sm"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 border border-blue-400/30"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-blue-200/20 shadow-xl backdrop-blur-sm">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => scrollToSection('privacy')}
                  className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                >
                  Privacy
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="block text-white/90 hover:text-blue-300 font-medium py-2 transition-colors duration-300 w-full text-left"
                >
                  Reviews
                </button>
              </div>
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-3 text-white border border-white/30 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
