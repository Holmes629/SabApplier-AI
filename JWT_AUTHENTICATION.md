# JWT Token-Based Authentication Implementation

## Overview

This implementation replaces the previous email/password authentication with a robust JWT (JSON Web Token) based authentication system. The system provides secure, stateless authentication with automatic token refresh and comprehensive error handling.

## Key Features

### 🔐 JWT Token Management
- **Secure Token Storage**: JWT tokens are stored in localStorage with automatic cleanup
- **Token Expiration Check**: Built-in validation to check token expiry
- **Automatic Refresh**: Tokens are automatically refreshed before expiration
- **Interceptor Integration**: Axios interceptors handle token attachment and refresh

### 🔄 Authentication Flow
1. **Login**: User provides credentials, receives JWT token
2. **Token Storage**: Token stored securely in localStorage
3. **Request Authentication**: Token automatically attached to API requests
4. **Token Validation**: Server validates token on each request
5. **Auto Refresh**: Token refreshed automatically when near expiry
6. **Logout**: Token removed and user session cleared

### 🛡️ Security Features
- **Stateless Authentication**: No session storage on server
- **Automatic Logout**: Invalid/expired tokens trigger automatic logout
- **CSRF Protection**: CSRF tokens included in requests
- **Token Validation**: Client-side token expiry checking
- **Secure Headers**: Proper Authorization headers with Bearer tokens

## Implementation Details

### Authentication Context (`AuthContext.js`)
- Centralized authentication state management
- Provides login, signup, logout, and profile completion methods
- Handles both email/password and Google OAuth authentication
- Manages token lifecycle and user data

### API Service Updates (`api.js`)
- Enhanced with JWT token management functions
- Axios interceptors for automatic token handling
- Token refresh logic with retry mechanisms
- Enhanced error handling for authentication failures

### Components
- **ProtectedRoute**: Wrapper for routes requiring authentication
- **TokenStatus**: Debug component showing token status (development only)
- **Updated Auth Pages**: Login, SignUp, and SignUpStep2 use new AuthContext

### Utilities
- **TokenManager**: Automatic token refresh and expiry monitoring
- **Token Validation**: Client-side JWT token parsing and validation

## Usage

### Basic Authentication Flow

```javascript
// Login
const { login } = useAuth();
const result = await login({ email, password });

// Check authentication status
const { isAuthenticated, user, token } = useAuth();

// Logout
const { logout } = useAuth();
await logout();
```

### Protected Routes

```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### API Calls with Automatic Token Handling

```javascript
// Tokens are automatically attached by Axios interceptors
const response = await api.getProfile();
```

## Configuration

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `NODE_ENV`: Environment setting (affects debug components)

### Token Settings
- **Refresh Buffer**: Tokens refresh 10 minutes before expiry
- **Check Interval**: Token expiry checked every 5 minutes
- **Auto Logout**: Triggered on refresh failure

## API Endpoints

### Required Backend Endpoints
- `POST /api/users/login/` - User login with JWT response
- `POST /api/users/register/` - User registration
- `POST /api/users/logout/` - User logout
- `POST /api/users/verify-token/` - Token validation
- `POST /api/users/refresh-token/` - Token refresh
- `POST /api/users/google-signup/` - Google OAuth login

### Expected JWT Payload
```json
{
  "user_id": 123,
  "email": "user@example.com",
  "exp": 1640995200,
  "iat": 1640908800
}
```

## Error Handling

### Client-Side
- Invalid tokens trigger automatic logout
- Network errors display user-friendly messages
- Token refresh failures redirect to login

### Server-Side Expected Responses
- `401 Unauthorized`: Invalid/expired token
- `200 OK`: Successful authentication
- `400 Bad Request`: Invalid credentials

## Security Best Practices

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS Only**: Ensure all communication uses HTTPS
3. **Token Expiry**: Reasonable token lifetime (recommended: 1-24 hours)
4. **Refresh Tokens**: Implement refresh tokens for extended sessions
5. **Logout Cleanup**: Complete token removal on logout

## Debugging

### Development Tools
- **TokenStatus Component**: Shows token status in development
- **Console Logging**: Detailed authentication flow logging
- **Error Messages**: User-friendly error display

### Debug Information
- Token expiry time
- User authentication status
- Token validation status
- Automatic refresh events

## Migration Notes

### From Previous System
- Replace `onLogin` props with `useAuth()` hook
- Update API calls to use new axios instance
- Remove manual token management code
- Update protected route implementations

### Breaking Changes
- Authentication props no longer passed to components
- Use `useAuth()` hook instead of prop drilling
- New authentication flow requires profile completion

## Future Enhancements

1. **Refresh Tokens**: Implement separate refresh tokens
2. **Multi-Device Support**: Token management across devices
3. **Session Management**: Advanced session handling
4. **Biometric Auth**: Integration with device biometrics
5. **SSO Integration**: Single Sign-On support

## Troubleshooting

### Common Issues
1. **Token Not Attached**: Check axios interceptor setup
2. **Automatic Logout**: Verify token refresh endpoint
3. **CORS Errors**: Ensure proper CORS configuration
4. **Invalid Token**: Check JWT secret and algorithm

### Debug Steps
1. Check browser localStorage for token
2. Verify token format and expiry
3. Check network requests for Authorization header
4. Monitor console for authentication errors

## Performance Considerations

- **Token Size**: Keep JWT payload minimal
- **Refresh Frequency**: Balance security vs. performance
- **Local Storage**: Consider memory usage
- **Network Requests**: Minimize authentication API calls

This JWT implementation provides a secure, scalable authentication system that enhances user experience while maintaining strong security practices.
