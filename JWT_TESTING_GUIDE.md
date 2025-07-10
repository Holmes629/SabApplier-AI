# JWT Authentication Testing Guide

## Testing the JWT Implementation

### Prerequisites
1. Backend server running on `http://localhost:8000` with JWT authentication endpoints
2. Frontend development server running
3. Browser with developer tools access

### Test Scenarios

#### 1. User Registration Flow
1. Navigate to `/signup`
2. Enter email and request OTP
3. Enter OTP and password
4. Complete profile in SignUpStep2
5. Verify JWT token is stored in localStorage
6. Check that user is redirected to dashboard

#### 2. Login Flow
1. Navigate to `/login`
2. Enter valid credentials
3. Verify JWT token is stored
4. Check automatic redirect to protected area
5. Verify user data is available in context

#### 3. Google OAuth Flow
1. Click "Sign in with Google" button
2. Complete Google authentication
3. Verify JWT token is stored
4. Check if profile completion is required
5. Complete profile if needed

#### 4. Protected Route Access
1. Try accessing `/profile` without authentication
2. Verify redirect to `/intro`
3. Login and verify access is granted
4. Check that Navbar shows authenticated state

#### 5. Automatic Token Refresh
1. Login with valid credentials
2. Wait for token to approach expiry (or modify expiry time)
3. Make an API request
4. Verify token is automatically refreshed
5. Check that user session continues seamlessly

#### 6. Token Expiry Handling
1. Login to get a valid token
2. Manually expire the token (modify localStorage)
3. Try to access a protected route
4. Verify automatic logout and redirect to login

#### 7. Logout Flow
1. Login to the application
2. Click logout button
3. Verify token is removed from localStorage
4. Check redirect to public area
5. Verify protected routes are no longer accessible

### Manual Testing Steps

#### Backend API Testing (using curl or Postman)

```bash
# 1. Register user
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 2. Login user
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 3. Access protected endpoint
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Refresh token
curl -X POST http://localhost:8000/api/users/refresh-token/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_JWT_TOKEN"}'
```

#### Frontend Testing with Browser DevTools

1. **Check localStorage**:
   ```javascript
   // In browser console
   localStorage.getItem('token')
   localStorage.getItem('currentUser')
   localStorage.getItem('isAuthenticated')
   ```

2. **Inspect JWT Token**:
   ```javascript
   // Decode JWT payload
   const token = localStorage.getItem('token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log(payload);
   ```

3. **Monitor Network Requests**:
   - Check Network tab for Authorization headers
   - Verify CSRF tokens are included
   - Watch for automatic token refresh requests

4. **Test Token Expiry**:
   ```javascript
   // Manually expire token for testing
   const token = localStorage.getItem('token');
   const parts = token.split('.');
   const payload = JSON.parse(atob(parts[1]));
   payload.exp = Math.floor(Date.now() / 1000) - 1; // Expired 1 second ago
   const expiredToken = parts[0] + '.' + btoa(JSON.stringify(payload)) + '.' + parts[2];
   localStorage.setItem('token', expiredToken);
   ```

### Debugging Tips

#### Common Issues and Solutions

1. **Token Not Attached to Requests**:
   - Check axios interceptor setup
   - Verify token exists in localStorage
   - Check for token expiry

2. **Automatic Logout on Refresh**:
   - Check token validation endpoint
   - Verify token format and signature
   - Check server-side JWT validation

3. **CORS Issues**:
   - Verify backend CORS configuration
   - Check for preflight request handling
   - Ensure Authorization header is allowed

4. **Token Refresh Failures**:
   - Verify refresh endpoint implementation
   - Check token refresh logic
   - Monitor refresh timing

#### Debug Components

1. **TokenStatus Component**:
   - Shows real-time token status
   - Displays expiry information
   - Only visible in development

2. **Console Logging**:
   - Authentication flow events
   - Token refresh attempts
   - Error messages and stack traces

### Performance Testing

#### Load Testing
1. Multiple simultaneous logins
2. Concurrent token refresh requests
3. Heavy protected route navigation

#### Memory Testing
1. Check for localStorage growth
2. Monitor for memory leaks
3. Test token cleanup on logout

### Security Testing

#### Basic Security Checks
1. Verify tokens expire appropriately
2. Check token storage security
3. Test logout complete cleanup
4. Verify CSRF protection

#### Token Security
1. Check JWT signature validation
2. Test with tampered tokens
3. Verify token scope and permissions
4. Test refresh token security

### Expected Backend Responses

#### Successful Login Response
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Token Refresh Response
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expires_at": "2023-12-31T23:59:59Z"
}
```

#### Error Responses
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error_code": "AUTH_FAILED"
}
```

### Checklist for Production

- [ ] HTTPS enabled for all authentication endpoints
- [ ] JWT secret key is secure and environment-specific
- [ ] Token expiry times are appropriate
- [ ] Refresh token mechanism implemented
- [ ] Rate limiting on authentication endpoints
- [ ] Error messages don't leak sensitive information
- [ ] Session cleanup on logout is complete
- [ ] CORS configuration is secure
- [ ] Debug components disabled in production
- [ ] Authentication state persistence works correctly

### Monitoring and Analytics

#### Key Metrics to Track
1. Authentication success/failure rates
2. Token refresh frequency
3. Session duration
4. Logout patterns
5. Authentication errors

#### Logging Requirements
1. Authentication attempts
2. Token refresh events
3. Automatic logout triggers
4. Security-related errors

This testing guide ensures comprehensive validation of the JWT authentication implementation across all user flows and edge cases.
