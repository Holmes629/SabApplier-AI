import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireProfileCompletion = false }) => {
  const { isAuthenticated, isLoading, isProfileComplete } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to intro/login
  if (!isAuthenticated) {
    return <Navigate to="/intro" state={{ from: location }} replace />;
  }

  // If authenticated but profile not complete and it's required, redirect to profile completion
  // Note: Profile completion is not required by default for existing users
  // SignUpStep2 is only for new users during signup flow
  if (requireProfileCompletion && !isProfileComplete()) {
    return <Navigate to="/signup-page2" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
