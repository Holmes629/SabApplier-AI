import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TokenStatus = ({ showInProduction = false }) => {
  const { token, user, isAuthenticated, isLoading } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);

  // Only show in development unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    console.log('TokenStatus Debug:', {
      contextToken: !!token,
      contextUser: !!user,
      contextIsAuthenticated: isAuthenticated,
      contextIsLoading: isLoading,
      storedToken: !!storedToken,
      storedUser: !!storedUser,
      storedAuth: storedAuth
    });

    if (token || storedToken) {
      const tokenToUse = token || storedToken;
      try {
        const payload = JSON.parse(atob(tokenToUse.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;
        
        setTokenInfo({
          isValid: timeUntilExpiry > 0,
          expiresAt: new Date(payload.exp * 1000).toLocaleString(),
          timeUntilExpiry: Math.floor(timeUntilExpiry / 60), // minutes
          userId: payload.user_id,
          email: payload.email,
          tokenSource: token ? 'context' : 'localStorage'
        });
      } catch (error) {
        setTokenInfo({ isValid: false, error: 'Invalid token format' });
      }
    } else {
      setTokenInfo(null);
    }
  }, [token, user, isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs">
        <strong>Auth Status:</strong> Loading...
      </div>
    );
  }

  if (!isAuthenticated && !tokenInfo) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
        <strong>Auth Status:</strong> Not authenticated
        <div><strong>Context:</strong> isAuth={String(isAuthenticated)}, token={!!token}</div>
        <div><strong>Storage:</strong> token={!!localStorage.getItem('token')}, auth={localStorage.getItem('isAuthenticated')}</div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 px-3 py-2 rounded text-xs border ${
      tokenInfo?.isValid 
        ? 'bg-green-100 border-green-400 text-green-700' 
        : 'bg-red-100 border-red-400 text-red-700'
    }`}>
      <div><strong>Auth Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div><strong>User:</strong> {user?.email || 'Unknown'}</div>
      {tokenInfo && (
        <>
          <div><strong>Token Valid:</strong> {String(tokenInfo.isValid)}</div>
          <div><strong>Source:</strong> {tokenInfo.tokenSource}</div>
          {tokenInfo.isValid && (
            <>
              <div><strong>Expires:</strong> {tokenInfo.expiresAt}</div>
              <div><strong>Time left:</strong> {tokenInfo.timeUntilExpiry} min</div>
            </>
          )}
          {tokenInfo.error && (
            <div><strong>Error:</strong> {tokenInfo.error}</div>
          )}
        </>
      )}
    </div>
  );
};

export default TokenStatus;
