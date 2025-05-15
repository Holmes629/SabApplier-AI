import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import TrackApplications from './pages/TrackApplications/TrackApplications';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ExamDetails from './pages/ExamDetails/ExamDetails';
import { getApplicationsFromStorage, saveApplicationsToStorage } from './data/applicationsData';
import { api } from './services/api';
import Docs from './pages/Profile/Docs';
import SignUpStep2 from './pages/Auth/SignUpStep2';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [isSignUp2, setIsSignUp2] = useState(() => {
    return localStorage.getItem('isSignUp2') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [applications, setApplications] = useState([]);

  // Initialize applications on component mount
  useEffect(() => {
    setApplications(getApplicationsFromStorage());
  }, []);

  // Save applications to storage whenever they change
  useEffect(() => {
    if (applications.length > 0) {
      saveApplicationsToStorage(applications);
    }
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);
  useEffect(() => {
    localStorage.setItem('isSignUp2', isSignUp2);
  }, [isSignUp2]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const toggleCart = (id) => {
    setApplications(applications.map(app => {
      if (app.id === id) {
        return { ...app, isCart: !app.isCart };
      }
      return app;
    }));
  };

  const handleLogin = async (userData) => {
    try {
      const response = await api.login(userData);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");

       // Display message to user
       const messageElement = document.createElement('div');
       messageElement.textContent = 'User Logged in successfully';
       messageElement.style.cssText = 'position: fixed; top: 70px; right: 45%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
       document.body.appendChild(messageElement);
       setTimeout(() => document.body.removeChild(messageElement), 1000); // Remove after 10sec

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSignUp = async (userData) => {
    try {
      const response = await api.signup(userData);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");

       // Display message to user
       const messageElement = document.createElement('div');
       messageElement.textContent = 'User Created successfully, please complete you profile data...';
       messageElement.style.cssText = 'position: fixed; top: 70px; right: 50%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
       document.body.appendChild(messageElement);
       setTimeout(() => document.body.removeChild(messageElement), 1000); // Remove after 10sec
      
       return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSignUp2 = async (userData) => {
    try {
      const response = await api.update(userData);
      
      setIsSignUp2(true);
      localStorage.setItem("isSignUp2", "true");

       // Display message to user
       const messageElement = document.createElement('div');
       messageElement.textContent = 'User Signed up successfully';
       messageElement.style.cssText = 'position: fixed; top: 70px; right: 50%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
       document.body.appendChild(messageElement);
       setTimeout(() => document.body.removeChild(messageElement), 1000); // Remove after 10sec
      
       return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout(localStorage.getItem("currentUser"));
      setIsAuthenticated(false);
      setIsSignUp2(false);
      setCurrentUser(null);
      localStorage.setItem("currentUser", null);
      localStorage.setItem("isSignUp2", false);
      localStorage.setItem("isAuthenticated", false);
      // Display message to user
      const messageElement = document.createElement('div');
      messageElement.textContent = 'You have been logged out';
      messageElement.style.cssText = 'position: fixed; top: 50px; right: 45%; padding: 10px; background:rgb(249, 30, 63); color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 1000); // Remove after 10sec

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const cartCount = applications.filter(app => app.isCart).length;
  
  return (
    <Router>
      <div className="app">
        {isSignUp2 && <Header cartCount={cartCount} onLogout={handleLogout} currentUser={currentUser} />}
        <Routes>
          <Route 
            path="/privacy_policy" 
            element={ isAuthenticated ? <Navigate to="/privacy_policy" replace /> : <PrivacyPolicy/>} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/signup-page2" replace /> : <SignUp onSignUp={handleSignUp} />} 
          />
          <Route 
            path="/signup-page2" 
            element={isSignUp2 ? <Navigate to="/" replace /> : <SignUpStep2 onSignUp2={ handleSignUp2 } />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home applications={applications} onToggleCart={toggleCart} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart applications={applications} onToggleCart={toggleCart} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/track" 
            element={
              <ProtectedRoute>
                <TrackApplications applications={applications} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile applications={applications} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/docs" 
            element={
              <ProtectedRoute>
                <Docs docUpload={handleSignUp2} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exam/:id" 
            element={
              <ProtectedRoute>
                <ExamDetails applications={applications} onToggleCart={toggleCart} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 