import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import ShortlistedApplications from './pages/ShortlistedApplications/ShortlistedApplications';
import TrackApplications from './pages/TrackApplications/TrackApplications';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ExamDetails from './pages/ExamDetails/ExamDetails';
import { getApplicationsFromStorage, saveApplicationsToStorage } from './data/applicationsData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
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
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const toggleShortlist = (id) => {
    setApplications(applications.map(app => {
      if (app.id === id) {
        return { ...app, isShortlisted: !app.isShortlisted };
      }
      return app;
    }));
  };

  const handleLogin = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === userData.email && u.password === userData.password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSignUp = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const shortlistedCount = applications.filter(app => app.isShortlisted).length;

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Header shortlistedCount={shortlistedCount} onLogout={handleLogout} currentUser={currentUser} />}
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp onSignUp={handleSignUp} />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home applications={applications} onToggleShortlist={toggleShortlist} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shortlisted" 
            element={
              <ProtectedRoute>
                <ShortlistedApplications applications={applications} onToggleShortlist={toggleShortlist} />
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
            path="/exam/:id" 
            element={
              <ProtectedRoute>
                <ExamDetails applications={applications} onToggleShortlist={toggleShortlist} />
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