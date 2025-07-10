import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
// import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import DataSharing from './pages/DataSharing/DataSharing';
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
import Waitlist from './pages/Waitlist/Waitlist';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { tokenManager } from './utils/tokenManager';

// Create a wrapper component that uses useLocation and useAuth
function AppContent() {
  const location = useLocation();
  const { user, isAuthenticated, logout, isProfileComplete, isLoading, hasWebsiteAccess, checkWebsiteAccess } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [accessCheckLoading, setAccessCheckLoading] = useState(true);

  // Check if user is fully authenticated (has completed profile)
  const isFullyAuthenticated = isAuthenticated && isProfileComplete();

  // Check website access on authentication
  useEffect(() => {
    const checkAccess = async () => {
      if (isAuthenticated && user?.email) {
        try {
          setAccessCheckLoading(true);
          await checkWebsiteAccess(user.email);
        } catch (error) {
          console.error('Access check failed:', error);
        } finally {
          setAccessCheckLoading(false);
        }
      } else {
        setAccessCheckLoading(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, user?.email, checkWebsiteAccess]);

  const ProtectedRoute = ({ children }) => {
    // Show loading spinner while checking authentication or access
    if (isLoading || accessCheckLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // If not authenticated, redirect to intro
    if (!isAuthenticated) {
      return <Navigate to="/intro" replace />;
    }

    // If authenticated but profile not complete, redirect to profile completion
    if (isAuthenticated && !isProfileComplete()) {
      return <Navigate to="/signup-page2" replace />;
    }

    // If authenticated and profile complete but no website access, redirect to waitlist
    if (isAuthenticated && isProfileComplete() && !hasWebsiteAccess) {
      return <Navigate to="/waitlist" replace />;
    }

    // If fully authenticated and has access, render the protected component
    return children;
  };

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

  // Initialize token manager for automatic token refresh
  useEffect(() => {
    // Token manager is already initialized as a singleton
    // Cleanup on unmount
    return () => {
      tokenManager.destroy();
    };
  }, []);

  // Save applications to storage whenever they change
  useEffect(() => {
    if (applications.length > 0) {
      saveApplicationsToStorage(applications);
    }
  }, [applications]);

  // Add document upload function
  const handleDocUpload = async (fileData) => {
    try {
      console.log('Uploading document:', fileData);
      
      // Get current user email
      if (!user || !user.email) {
        throw new Error("User not found. Please log in again.");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('email', user.email);
      
      // Add files to form data
      Object.entries(fileData).forEach(([fieldName, file]) => {
        formData.append(fieldName, file);
      });

      const response = await api.updateProfile(formData);
      
      if (response.success || response.user_data) {
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

  return (
    <div className="app">
      {isFullyAuthenticated && hasWebsiteAccess && location.pathname !== '/manage-docs' && (
        <Navbar 
          isAuthenticated={true}
          // cartCount={cartCount} 
          onLogout={logout} 
          currentUser={user} 
        />
      )}
      <Routes>
        <Route 
          path="/privacy-policy" 
          element={<PrivacyPolicy/>} 
        />
        <Route 
          path="/waitlist" 
          element={<Waitlist />} 
        />
        <Route 
          path="/intro" 
          element={
            isFullyAuthenticated && hasWebsiteAccess ? 
              <Navigate to="/" replace /> : 
              isFullyAuthenticated && !hasWebsiteAccess ?
                <Navigate to="/waitlist" replace /> :
                <Intro />
          } 
        />
        <Route 
          path="/login" 
          element={
            isFullyAuthenticated && hasWebsiteAccess ? 
              <Navigate to="/" replace /> : 
              isFullyAuthenticated && !hasWebsiteAccess ?
                <Navigate to="/waitlist" replace /> :
                <Login />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isFullyAuthenticated && hasWebsiteAccess ? 
              <Navigate to="/" replace /> : 
              isFullyAuthenticated && !hasWebsiteAccess ?
                <Navigate to="/waitlist" replace /> :
                <SignUp />
          } 
        />
        <Route 
          path="/signup-page2" 
          element={
            isFullyAuthenticated && hasWebsiteAccess ? 
              <Navigate to="/" replace /> : 
              isFullyAuthenticated && !hasWebsiteAccess ?
                <Navigate to="/waitlist" replace /> :
                <SignUpStep2 />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={isFullyAuthenticated ? <Navigate to="/login" replace /> : <ForgotPassword />} 
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
          path="/data-sharing" 
          element={
            <ProtectedRoute>
              <DataSharing />
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
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;