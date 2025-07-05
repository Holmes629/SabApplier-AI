/**
 * Authentication utilities for JWT token management
 */

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Handle fallback tokens (not JWT format)
    if (token.startsWith('google-temp-') || token.startsWith('manual-fix-') || !token.includes('.')) {
      console.log('⚠️ Non-JWT token detected, treating as valid for now:', token.substring(0, 20) + '...');
      return false; // Fallback tokens are considered valid
    }
    
    // Standard JWT token validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('⚠️ Invalid JWT format, treating as expired');
      return true;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      console.log('❌ JWT token is expired');
    }
    
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get user data from JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - User data or null if invalid
 */
export const getUserFromToken = (token) => {
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.user_id,
      email: payload.email,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
};

/**
 * Get time until token expires in minutes
 * @param {string} token - JWT token
 * @returns {number} - Minutes until expiration (negative if expired)
 */
export const getTokenTimeRemaining = (token) => {
  if (!token) return 0;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeRemaining = payload.exp - currentTime;
    return Math.floor(timeRemaining / 60); // Convert to minutes
  } catch (error) {
    console.error('Error calculating token time remaining:', error);
    return 0;
  }
};

/**
 * Check if token needs refresh (within buffer time)
 * @param {string} token - JWT token
 * @param {number} bufferMinutes - Buffer time in minutes (default: 10)
 * @returns {boolean} - True if token should be refreshed
 */
export const shouldRefreshToken = (token, bufferMinutes = 10) => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining > 0 && timeRemaining <= bufferMinutes;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  const keysToRemove = [
    'token',
    'currentUser',
    'isAuthenticated',
    'isSignUp2',
    'googleData',
    'signupData'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get authentication headers for API requests
 * @returns {object} - Headers object with Authorization if token exists
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token && !isTokenExpired(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Format token expiry time for display
 * @param {string} token - JWT token
 * @returns {string} - Formatted expiry time
 */
export const formatTokenExpiry = (token) => {
  if (!token) return 'No token';
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryDate = new Date(payload.exp * 1000);
    return expiryDate.toLocaleString();
  } catch (error) {
    return 'Invalid token';
  }
};

/**
 * Validate token format (basic structure check)
 * @param {string} token - JWT token
 * @returns {boolean} - True if token has valid format
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage key: ${key}`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key: ${key}`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key: ${key}`, error);
      return false;
    }
  },
  
  getJSON: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage key: ${key}`, error);
      return null;
    }
  },
  
  setJSON: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error storing JSON to localStorage key: ${key}`, error);
      return false;
    }
  }
};

export default {
  isTokenExpired,
  getUserFromToken,
  getTokenTimeRemaining,
  shouldRefreshToken,
  clearAuthData,
  getAuthHeaders,
  formatTokenExpiry,
  isValidTokenFormat,
  storage
};
