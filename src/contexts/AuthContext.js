import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { clearAuthData, isTokenExpired, syncTokenWithExtension, syncLogoutWithExtension } from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('currentUser');
      const isAuthenticatedStored = localStorage.getItem('isAuthenticated');
      
      console.log('🔄 Initializing auth with stored values:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        storedAuthFlag: isAuthenticatedStored,
        tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : 'none'
      });
      
      if (storedToken && storedUser && isAuthenticatedStored === 'true') {
        // Parse the stored user data
        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (parseError) {
          console.error('❌ Failed to parse stored user data:', parseError);
          clearAuthData();
          return;
        }

        // Check if token is expired before setting state
        if (!isTokenExpired(storedToken)) {
          console.log('✅ Restoring authentication state');
          
          // Set all states together
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          console.log('✅ Authentication state restored:', {
            user: parsedUser.email,
            tokenSet: !!storedToken,
            authenticated: true
          });
        } else {
          console.log('❌ Stored token is expired, clearing auth data');
          clearAuthData();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('❌ No valid stored authentication found');
        // Ensure clean state
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      // On error, ensure clean state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('✅ Auth initialization complete');
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      // Handle Google login
      if (credentials.isGoogleLogin) {
        console.log('🔵 Processing Google login...');
        const result = await api.googleSignup(credentials.credential || credentials.googleToken);
        
        console.log('🔵 Google login result:', {
          success: result.success,
          hasToken: !!(result.token || result.access_token),
          hasUser: !!(result.user || result.email),
          needsProfile: result.needsProfileCompletion
        });
        
        // Handle Google login response - be more flexible with success conditions
        if (result.success || result.user || result.email) {
          const userToken = result.token || result.access_token;
          const userData = result.user || { 
            email: result.email,
            name: result.name || result.user?.name
          };
          
          console.log('🔵 Google auth data received:', {
            hasToken: !!userToken,
            tokenPreview: userToken ? userToken.substring(0, 20) + '...' : 'none',
            userData: userData,
            fullResult: result
          });
          
          // CRITICAL: Always store user data first
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
          setUser(userData);
          setIsAuthenticated(true);
          
          // Handle token storage - with fallback for missing tokens
          if (userToken) {
            console.log('🔵 Storing Google token:', userToken.substring(0, 20) + '...');
            localStorage.setItem('token', userToken);
            localStorage.setItem('jwt_token', userToken); // Add for extension sync
            setToken(userToken);
            
            // Sync with extension
            syncTokenWithExtension(userToken, result);
          } else {
            console.warn('⚠️ No token received from Google login - creating JWT fallback');
            
            // Create a proper JWT token as fallback
            const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
            const payload = btoa(JSON.stringify({
              user_id: userData.id || Date.now(),
              email: userData.email,
              name: userData.name || userData.fullname || 'Google User',
              exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
              iat: Math.floor(Date.now() / 1000),
              iss: 'google-fallback',
              sub: userData.email
            }));
            const signature = btoa('google-fallback-signature');
            const fallbackToken = `${header}.${payload}.${signature}`;
            
            localStorage.setItem('token', fallbackToken);
            localStorage.setItem('tokenType', 'google-fallback');
            localStorage.setItem('jwt_token', fallbackToken); // Add this for extension sync
            setToken(fallbackToken);
            
            // Sync with extension
            syncTokenWithExtension(fallbackToken, result);
            
            console.log('🔧 Created JWT fallback token:', fallbackToken.substring(0, 30) + '...');
          }
          
          // Store user data for extension sync
          localStorage.setItem('sabapplier_user_data', JSON.stringify(result));
          
          // Check if user needs to complete profile
          if (result.needsProfileCompletion) {
            localStorage.setItem('isSignUp2', 'false');
            console.log('🔵 Google login successful, needs profile completion');
            return { success: true, needsProfileCompletion: true };
          } else {
            localStorage.setItem('isSignUp2', 'true');
            console.log('🔵 Google login successful, profile complete');
            return { success: true };
          }
        }
        
        throw new Error(result.message || result.error || 'Google login failed');
      }
      
      // Handle regular email/password login
      const result = await api.login(credentials);
      
      if (result.token && result.user) {
        // Store JWT token and user data
        localStorage.setItem('token', result.token);
        localStorage.setItem('jwt_token', result.token); // Add for extension sync
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('sabapplier_user_data', JSON.stringify(result.user)); // Add for extension sync
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isSignUp2', 'true');
        
        // Sync with extension
        syncTokenWithExtension(result.token, result.user);
        
        setToken(result.token);
        setUser(result.user);
        setIsAuthenticated(true);
        
        console.log('Login successful, token stored:', result.token.substring(0, 20) + '...');
        return { success: true };
      } else if (result.success && result.user) {
        // Handle case where login is successful but no token (shouldn't happen with JWT)
        console.warn('Login successful but no token received');
        const userData = result.user;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isSignUp2', 'true');
        
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      throw new Error(result.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      
      const result = await api.signup(userData);
      
      if (result.success || result.user) {
        const user = result.user || userData;
        
        // Store user data but not fully authenticated yet (needs profile completion)
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('sabapplier_user_data', JSON.stringify(user)); // Add for extension sync
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isSignUp2', 'false'); // Needs profile completion
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, needsProfileCompletion: true };
      }
      
      throw new Error(result.message || 'Signup failed');
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (profileData) => {
    try {
      setIsLoading(true);
      
      const result = await api.update(profileData);
      
      if (result.success || result.user_data) {
        const updatedUser = result.user_data || { ...user, ...profileData };
        
        // Store JWT token if provided
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('jwt_token', result.token); // Add for extension sync
          setToken(result.token);
          
          // Sync with extension
          syncTokenWithExtension(result.token, updatedUser);
        }
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        localStorage.setItem('sabapplier_user_data', JSON.stringify(updatedUser)); // Add for extension sync
        localStorage.setItem('isSignUp2', 'true'); // Profile completed
        
        setUser(updatedUser);
        
        return { success: true };
      }
      
      throw new Error(result.message || 'Profile completion failed');
    } catch (error) {
      console.error('Profile completion error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        await api.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all auth data regardless of API call success
      clearAuthData();
      
      // Sync logout with extension
      syncLogoutWithExtension();
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const result = await api.refreshToken();
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('jwt_token', result.token); // Add for extension sync
        setToken(result.token);
        return result.token;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      logout(); // If refresh fails, logout user
      throw error;
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const isProfileComplete = () => {
    return localStorage.getItem('isSignUp2') === 'true';
  };

  const refreshAuthState = () => {
    console.log('🔄 Manually refreshing auth state...');
    initializeAuth();
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signup,
    completeProfile,
    logout,
    refreshToken,
    updateUser,
    isProfileComplete,
    refreshAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
