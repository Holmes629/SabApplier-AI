import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
// import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login'
import Intro from './pages/Intro/Intro';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
// import ExamDetails from './pages/ExamDetails/ExamDetails';
import { getApplicationsFromStorage, saveApplicationsToStorage } from './data/applicationsData';
import { api } from './services/api';
import Docs from './pages/Profile/Docs';
import AutoFillData from './pages/AutoFillData/AutoFillData';
import SignUpStep2 from './pages/Auth/SignUpStep2';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';

// Create a wrapper component that uses useLocation
function AppContent({ isSignUp2, /* cartCount, */ handleLogout, currentUser, applications, handleLogin, handleSignUp, handleSignUp2, /* toggleCart, */ loadingExams, handleDocUpload }) {
  const location = useLocation();

  const ProtectedRoute = ({ children }) => {
    if (!isSignUp2) {
      return <Navigate to="/intro" replace />;
    }
    return children;
  };

  return (
    <div className="app">
      {isSignUp2 && location.pathname !== '/manage-docs' && (
        <Navbar 
          isAuthenticated={true}
          // cartCount={cartCount} 
          onLogout={handleLogout} 
          currentUser={currentUser} 
        />
      )}
      <Routes>
        <Route 
          path="/privacy_policy" 
          element={isSignUp2 ? <Navigate to="/privacy-policy" replace /> : <PrivacyPolicy/>} 
        />
        <Route 
          path="/intro" 
          element={isSignUp2 ? <Navigate to="/" replace /> : <Intro onLogin={handleLogin} />} 
        />
        <Route 
          path="/login" 
          element={isSignUp2 ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/signup" 
          element={isSignUp2 ? <Navigate to="/signup-page2" replace /> : <SignUp onSignUp={handleSignUp} />} 
        />
        <Route 
          path="/signup-page2" 
          element={isSignUp2 ? <Navigate to="/" replace /> : <SignUpStep2 onSignUp2={handleSignUp2} />} 
        />
        <Route 
          path="/forgot-password" 
          element={isSignUp2 ? <Navigate to="/login" replace /> : <ForgotPassword />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home applications={applications} /* onToggleCart={toggleCart} */ loadingExams={loadingExams} />
            </ProtectedRoute>
          } 
        />
        {/* 
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart applications={applications} onToggleCart={toggleCart} />
            </ProtectedRoute>
          } 
        />
        */}
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
              <Docs applications={applications} docUpload={handleDocUpload} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/auto-fill-data" 
          element={
            <ProtectedRoute>
              <AutoFillData applications={applications} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-docs" 
          element={
            <ProtectedRoute>
              <Docs applications={applications} docUpload={handleDocUpload} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

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
  const [loadingExams, setLoadingExams] = useState(true);

  // Initialize applications on component mount
  useEffect(() => {
    const initializeApplications = async () => {
      try {
        setLoadingExams(true);
        const examData = await getApplicationsFromStorage();
        console.log('🔄 App.js - Loaded exam data:', examData.length, 'exams');
        console.log('📋 App.js - Exam titles:', examData.map(app => app.title));
        setApplications(examData);
      } catch (error) {
        console.error('Error loading exam data:', error);
        setApplications([]);
      } finally {
        setLoadingExams(false);
      }
    };

    initializeApplications();
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

  /*
  const toggleCart = (id) => {
    setApplications(applications.map(app => {
      if (app.id === id) {
        return { ...app, isCart: !app.isCart };
      }
      return app;
    }));
  };
  */

  const handleLogin = async (userData) => {
    try {
      localStorage.clear();
      
      // Handle Google login differently
      if (userData.isGoogleLogin) {
        const user = userData.userData || { email: userData.email };
        
        // Store Google data if provided
        if (userData.googleData) {
          localStorage.setItem("googleData", JSON.stringify(userData.googleData));
        }
        
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setIsAuthenticated(true);
        setIsSignUp2(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isSignUp2", "true");

        // Display message to user
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Google login successful';
        messageElement.style.cssText = 'position: fixed; top: 70px; right: 45%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 1000);

        return { success: true };
      }

      // Regular email/password login
      const response = await api.login(userData);
      const user = response.user || userData;
      if (!user.email) {
        throw new Error("Login response missing email.");
      }
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsAuthenticated(true);
      setIsSignUp2(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isSignUp2", "true");

      // Display message to user
      const messageElement = document.createElement('div');
      messageElement.textContent = 'User Logged in successfully';
      messageElement.style.cssText = 'position: fixed; top: 70px; right: 45%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 1000);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSignUp = async (userData) => {
    try {
      const response = await api.signup(userData);
      let user = response.user && response.user.email ? response.user : userData;
      if (!user.email && userData.email) {
        user = { ...user, email: userData.email };
      }
      if (!user.email) {
        throw new Error("Signup response missing email.");
      }
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsAuthenticated(true);
      setIsSignUp2(false);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isSignUp2", "false");

      // Display message to user
      const messageElement = document.createElement('div');
      messageElement.textContent = 'User Created successfully, please complete your profile data...';
      messageElement.style.cssText = 'position: fixed; top: 70px; right: 50%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 1000);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSignUp2 = async (userData) => {
    try {
      const response = await api.update(userData);
      
      // Use the user_data returned from the backend if available
      const updatedUserData = response.user_data || { ...currentUser, ...userData };
      setCurrentUser(updatedUserData);
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
      
      setIsSignUp2(true);
      localStorage.setItem("isSignUp2", "true");

      // Display message to user
      const messageElement = document.createElement('div');
      messageElement.textContent = 'Profile completed successfully!';
      messageElement.style.cssText = 'position: fixed; top: 70px; right: 50%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Profile update failed' };
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
      localStorage.clear();
      // Display message to user
      const messageElement = document.createElement('div');
      messageElement.textContent = 'You have been logged out';
      messageElement.style.cssText = 'position: fixed; top: 130px; left:50%; transform: translate(-50%, -50%); padding: 10px; background: rgb(249, 30, 63); color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 1000);

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Add document upload function
  const handleDocUpload = async (fileData) => {
    try {
      console.log('Uploading document:', fileData);
      
      // Get current user email
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.email) {
        throw new Error("User not found. Please log in again.");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('email', currentUser.email);
      
      // Add files to form data
      Object.entries(fileData).forEach(([fieldName, file]) => {
        formData.append(fieldName, file);
      });

      const response = await api.updateProfile(formData);
      
      if (response.success || response.user_data) {
        // Update current user data in localStorage
        if (response.user_data) {
          setCurrentUser(response.user_data);
          localStorage.setItem("currentUser", JSON.stringify(response.user_data));
        }
        
        // Show success message
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Document uploaded successfully!';
        messageElement.style.cssText = 'position: fixed; top: 70px; right: 45%; padding: 10px; background: #4CAF50; color: white; border-radius: 4px; z-index: 1000;';
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 3000);
        
        return response;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      
      // Show error message
      const messageElement = document.createElement('div');
      messageElement.textContent = `Upload failed: ${error.message}`;
      messageElement.style.cssText = 'position: fixed; top: 70px; right: 45%; padding: 10px; background: #f56565; color: white; border-radius: 4px; z-index: 1000;';
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 3000);
      
      throw error;
    }
  };

  // const cartCount = applications.filter(app => app.isCart).length;

  return (
    <Router>
      <AppContent 
        isSignUp2={isSignUp2}
        // cartCount={cartCount}
        handleLogout={handleLogout}
        currentUser={currentUser}
        applications={applications}
        handleLogin={handleLogin}
        handleSignUp={handleSignUp}
        handleSignUp2={handleSignUp2}
        // toggleCart={toggleCart}
        loadingExams={loadingExams}
        handleDocUpload={handleDocUpload}
      />
    </Router>
  );
}

export default App;