import { api } from '../services/api';

class TokenManager {
  constructor() {
    this.refreshPromise = null;
    this.refreshTimer = null;
    this.initializeTokenRefresh();
  }

  initializeTokenRefresh() {
    // Check token expiration every 5 minutes
    this.refreshTimer = setInterval(() => {
      this.checkAndRefreshToken();
    }, 5 * 60 * 1000);

    // Initial check
    this.checkAndRefreshToken();
  }

  async checkAndRefreshToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check if token is close to expiring (within 10 minutes)
      if (this.isTokenNearExpiry(token)) {
        await this.refreshToken();
      }
    } catch (error) {
      console.error('Token check failed:', error);
    }
  }

  isTokenNearExpiry(token, bufferMinutes = 10) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const expiryTime = payload.exp;
      const bufferTime = bufferMinutes * 60;
      
      return (expiryTime - currentTime) <= bufferTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if we can't parse
    }
  }

  async refreshToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = api.refreshToken()
      .then((result) => {
        console.log('Token refreshed successfully');
        return result;
      })
      .catch((error) => {
        console.error('Token refresh failed:', error);
        // Clear auth state on refresh failure
        localStorage.clear();
        window.location.href = '/login';
        throw error;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

export default TokenManager;
