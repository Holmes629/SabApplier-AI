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
    'signupData',
    // Extension sync keys
    'jwt_token',
    'sabapplier_jwt_token',
    'sabapplier_user_data',
    'tokenType'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Also clear session storage
  keysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
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

/**
 * Sync JWT token with the SabApplier extension
 * @param {string} token - JWT token to sync
 * @param {object} userData - User data to sync
 */
export const syncTokenWithExtension = (token, userData = null) => {
  if (!token) return;
  try {
    console.log('[SYNC] syncTokenWithExtension called:', { token: token.substring(0, 20) + '...', userData });
    // Method 1: Store with extension-specific keys
    localStorage.setItem('sabapplier_extension_jwt', token);
    localStorage.setItem('sabapplier_extension_user', JSON.stringify(userData || {}));
    localStorage.setItem('sabapplier_extension_sync_timestamp', Date.now().toString());
    console.log('[SYNC] localStorage updated for extension');
    // Method 2: Dispatch custom event for the extension content script
    window.dispatchEvent(new CustomEvent('sabapplier_jwt_login', {
      detail: {
        token: token,
        userData: userData
      }
    }));
    console.log('[SYNC] Custom event sabapplier_jwt_login dispatched');
    // Method 3: Try storage event (cross-tab communication)
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sabapplier_extension_jwt',
      newValue: token,
      oldValue: null,
      storageArea: localStorage
    }));
    console.log('[SYNC] StorageEvent dispatched');
    // Method 4: Set window flags for extension detection
    window.sabApplierJWTToken = token;
    window.sabApplierUserData = userData;
    window.sabApplierExtensionSync = {
      token: token,
      userData: userData,
      timestamp: Date.now()
    };
    console.log('[SYNC] window flags set');
    // Method 5: Post message to window (for content script detection)
    window.postMessage({
      type: 'SABAPPLIER_JWT_TOKEN',
      token: token,
      userData: userData,
      timestamp: Date.now()
    }, window.location.origin);
    console.log('[SYNC] window.postMessage SABAPPLIER_JWT_TOKEN sent');
    // Method 6: Try to communicate with extension via injected script
    const script = document.createElement('script');
    script.textContent = `
      try {
        if (window.chrome && window.chrome.runtime) {
          console.log('[SYNC] Trying direct extension communication...');
          window.dispatchEvent(new CustomEvent('sabapplier_extension_sync', {
            detail: { token: '${token}', userData: ${JSON.stringify(userData)} }
          }));
        }
      } catch (e) {
        console.log('[SYNC] Extension communication attempt:', e.message);
      }
    `;
    document.head.appendChild(script);
    document.head.removeChild(script);
    console.log('[SYNC] injected script for extension communication');
    console.log('[SYNC] JWT token synced with SabApplier Extension (multiple methods)');
    console.log('[SYNC] Token preview:', token.substring(0, 30) + '...');
    console.log('[SYNC] User data:', userData);
  } catch (error) {
    console.error('[SYNC] Error syncing token with extension:', error);
  }
};

/**
 * Notify extension about logout
 */
export const syncLogoutWithExtension = () => {
  try {
    console.log('🔄 Syncing logout with SabApplier Extension...');
    
    // Method 1: Clear extension-specific localStorage keys
    localStorage.removeItem('sabapplier_extension_jwt');
    localStorage.removeItem('sabapplier_extension_user');
    localStorage.removeItem('sabapplier_extension_sync_timestamp');
    
    // Method 2: Dispatch custom logout event
    window.dispatchEvent(new CustomEvent('sabapplier_jwt_logout', {
      detail: {
        action: 'logout',
        timestamp: Date.now()
      }
    }));
    
    // Method 3: Dispatch extension-specific logout event
    window.dispatchEvent(new CustomEvent('sabapplier_extension_logout', {
      detail: {
        action: 'logout',
        timestamp: Date.now()
      }
    }));
    
    // Method 4: Post logout message to window
    window.postMessage({
      type: 'SABAPPLIER_LOGOUT',
      action: 'logout',
      timestamp: Date.now()
    }, window.location.origin);
    
    // Method 5: Clear window flags
    window.sabApplierJWTToken = null;
    window.sabApplierUserData = null;
    window.sabApplierExtensionSync = null;
    
    // Method 6: Set logout flag for extension polling
    localStorage.setItem('sabapplier_extension_logout', 'true');
    localStorage.setItem('sabapplier_extension_logout_timestamp', Date.now().toString());
    
    // Method 7: Remove the logout flag after a short delay (so polling can detect it)
    setTimeout(() => {
      localStorage.removeItem('sabapplier_extension_logout');
      localStorage.removeItem('sabapplier_extension_logout_timestamp');
    }, 5000);
    
    console.log('🔄 Logout synced with SabApplier Extension (multiple methods)');
  } catch (error) {
    console.error('Error syncing logout with extension:', error);
  }
};

const authUtils = {
  isTokenExpired,
  getUserFromToken,
  getTokenTimeRemaining,
  shouldRefreshToken,
  clearAuthData,
  getAuthHeaders,
  formatTokenExpiry,
  isValidTokenFormat,
  storage,
  syncTokenWithExtension,
  syncLogoutWithExtension
};

export default authUtils;
