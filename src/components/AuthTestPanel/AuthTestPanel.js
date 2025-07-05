import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthTestPanel = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    isProfileComplete 
  } = useAuth();

  const handleTestLogin = async () => {
    // Mock login for testing - replace with real credentials
    const result = await login({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Test login result:', result);
  };

  const handleTestLogout = async () => {
    await logout();
    console.log('Logged out');
  };

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSetMockAuth = () => {
    // Create a proper mock JWT token for testing
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payload = btoa(JSON.stringify({
      user_id: 1,
      email: 'test@example.com',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires in 1 hour
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = 'mock-signature';
    const mockToken = `${header}.${payload}.${signature}`;
    
    const mockUser = { 
      id: 1,
      email: 'test@example.com', 
      name: 'Test User',
      fullname: 'Test User'
    };
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isSignUp2', 'true');
    
    console.log('Mock auth data set:', {
      token: mockToken.substring(0, 30) + '...',
      user: mockUser
    });
    
    window.location.reload();
  };

  const handleFixCurrentState = () => {
    // Fix the current authentication state if user exists but token is missing
    if (user && !token) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('Attempting to fix auth state with stored token');
        // Force a page reload to reinitialize auth properly
        window.location.reload();
      } else {
        console.log('No stored token found, creating mock token for current user');
        // Create a proper mock JWT token for the current user
        const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
        const payload = btoa(JSON.stringify({
          user_id: user.id || 1,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // Expires in 24 hours
          iat: Math.floor(Date.now() / 1000)
        }));
        const signature = 'mock-signature';
        const mockToken = `${header}.${payload}.${signature}`;
        
        localStorage.setItem('token', mockToken);
        console.log('Mock token created for existing user:', mockToken.substring(0, 30) + '...');
        
        // Force page reload to reinitialize with token
        window.location.reload();
      }
    }
  };

  const handleRequestProperToken = async () => {
    // Request a proper JWT token from backend for current Google user
    if (user && user.email) {
      console.log('🔄 Requesting proper JWT token from backend...');
      
      try {
        // Call a backend endpoint to get a proper JWT token for the current user
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/users/generate-token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
            email: user.email
          })
        });
        
        const result = await response.json();
        
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('tokenType', 'backend-generated');
          console.log('✅ Proper JWT token received from backend:', result.token.substring(0, 30) + '...');
          window.location.reload();
        } else {
          console.error('❌ No token in backend response');
        }
        
      } catch (error) {
        console.error('❌ Failed to get proper token from backend:', error);
        
        // Fall back to creating a proper JWT token locally
        console.log('🔧 Creating proper JWT token locally as fallback...');
        handleFixGoogleAuth();
      }
    }
  };

  // Helper function to get CSRF token
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleTestTokenPersistence = () => {
    // Test if tokens persist across reloads
    console.log('🧪 Testing token persistence...');
    
    const testToken = 'test-token-' + Date.now();
    const testUser = { email: 'test@persistence.com', name: 'Test User' };
    
    // Store test data
    localStorage.setItem('token', testToken);
    localStorage.setItem('currentUser', JSON.stringify(testUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('🧪 Test data stored:', {
      token: testToken,
      user: testUser,
      storage: {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('currentUser'),
        auth: localStorage.getItem('isAuthenticated')
      }
    });
    
    // Reload to test persistence
    setTimeout(() => {
      console.log('🧪 Reloading to test persistence...');
      window.location.reload();
    }, 1000);
  };

  const handleTestGoogleLogin = async () => {
    // Test Google login flow with debug info
    console.log('🧪 Testing Google login flow...');
    
    // Mock Google credential response
    const mockGoogleCredential = 'mock-google-jwt-token';
    
    try {
      const result = await login({
        isGoogleLogin: true,
        credential: mockGoogleCredential
      });
      
      console.log('🧪 Google login test result:', {
        success: result.success,
        needsProfile: result.needsProfileCompletion,
        hasToken: !!localStorage.getItem('token'),
        hasUser: !!localStorage.getItem('currentUser')
      });
      
    } catch (error) {
      console.error('🧪 Google login test failed:', error);
    }
  };

  const handleFixGoogleAuth = () => {
    // Specific fix for Google authentication issues
    console.log('🔧 Fixing Google authentication state...');
    
    if (user && user.email) {
      // Create a valid JWT token for the Google user
      const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
      const payload = btoa(JSON.stringify({
        user_id: user.id || Date.now(), // Use timestamp as fallback ID
        email: user.email,
        name: user.name || user.fullname || 'Google User',
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
        iat: Math.floor(Date.now() / 1000)
      }));
      const signature = 'google-auth-fix';
      const fixedToken = `${header}.${payload}.${signature}`;
      
      // Store the fixed token
      localStorage.setItem('token', fixedToken);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isSignUp2', 'true');
      
      console.log('✅ Google auth fixed with token:', fixedToken.substring(0, 30) + '...');
      
      // Reload to apply changes
      window.location.reload();
    } else {
      console.error('❌ No user data found to fix');
    }
  };

  // Get localStorage values for debugging
  const storageValues = {
    token: localStorage.getItem('token'),
    currentUser: localStorage.getItem('currentUser'),
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    isSignUp2: localStorage.getItem('isSignUp2')
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🧪 Auth Test Panel</h3>
      
      <div className="space-y-1 text-xs mb-3">
        <div><strong>Context State:</strong></div>
        <div>• Status: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
        <div>• User: {user?.email || 'None'}</div>
        <div>• Token: {token ? `${token.substring(0, 10)}...` : 'None'}</div>
        <div>• Profile Complete: {String(isProfileComplete())}</div>
        
        <div className="mt-2"><strong>localStorage:</strong></div>
        <div>• token: {storageValues.token ? `${storageValues.token.substring(0, 10)}...` : 'None'}</div>
        <div>• user: {storageValues.currentUser ? 'EXISTS' : 'None'}</div>
        <div>• isAuth: {storageValues.isAuthenticated || 'None'}</div>
        <div>• isSignUp2: {storageValues.isSignUp2 || 'None'}</div>
      </div>

      {/* Show warning if user exists but token is missing */}
      {user && !token && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-2 py-1 rounded text-xs mb-2">
          ⚠️ User exists but token is missing!
          {user.email && user.email.includes('@gmail.com') && (
            <div className="mt-1">🔍 Detected Google account issue</div>
          )}
        </div>
      )}

      <div className="space-y-1">
        <button
          onClick={handleTestLogin}
          className="w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          Test Login
        </button>

        <button
          onClick={handleTestGoogleLogin}
          className="w-full px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
          disabled={isLoading}
        >
          🧪 Test Google Login
        </button>

        <button
          onClick={handleTestTokenPersistence}
          className="w-full px-2 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600"
        >
          🧪 Test Token Persistence
        </button>
        
        <button
          onClick={handleTestLogout}
          className="w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          disabled={isLoading}
        >
          Logout
        </button>
        
        <button
          onClick={handleSetMockAuth}
          className="w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Set Mock Auth
        </button>

        {user && !token && (
          <>
            <button
              onClick={handleFixCurrentState}
              className="w-full px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
            >
              Fix Auth State
            </button>
            
            {user.email && user.email.includes('@gmail.com') && (
              <>
                <button
                  onClick={handleRequestProperToken}
                  className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  🔄 Request Backend Token
                </button>
                
                <button
                  onClick={handleFixGoogleAuth}
                  className="w-full px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                >
                  🔧 Fix Google Auth
                </button>
              </>
            )}
          </>
        )}
        
        <button
          onClick={handleClearStorage}
          className="w-full px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          Clear Storage
        </button>

        {user && user.email && (
          <button
            onClick={handleRequestProperToken}
            className="w-full px-2 py-1 bg-pink-500 text-white text-xs rounded hover:bg-pink-600"
          >
            🔄 Request Proper Token
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthTestPanel;
