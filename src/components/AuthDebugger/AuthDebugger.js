import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthDebugger = () => {
  const { user, token, isAuthenticated, isLoading, isProfileComplete } = useAuth();

  useEffect(() => {
    const debugInfo = {
      'Auth Context State': {
        user: user ? `${user.email} (${Object.keys(user).join(', ')})` : null,
        token: token ? `${token.substring(0, 20)}...` : null,
        isAuthenticated,
        isLoading,
        isProfileComplete: isProfileComplete()
      },
      'localStorage Values': {
        token: localStorage.getItem('token') ? 'EXISTS' : 'NULL',
        currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null,
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        isSignUp2: localStorage.getItem('isSignUp2')
      }
    };

    console.log('🔍 AUTH DEBUG INFO:', debugInfo);
  }, [user, token, isAuthenticated, isLoading, isProfileComplete]);

  // This component doesn't render anything, it's just for debugging
  return null;
};

export default AuthDebugger;
