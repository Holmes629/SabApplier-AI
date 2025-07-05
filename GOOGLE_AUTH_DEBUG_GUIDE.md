# Google Authentication Debugging Guide

## Issue: "User exists but token is missing" after Google login

### Quick Fix
1. **Use the "🔧 Fix Google Auth" button** in the Auth Test Panel (bottom left of screen)
2. This will create a temporary JWT token for your Google account
3. The page will reload with proper authentication

### Detailed Debugging Steps

#### Step 1: Check Current State
Look at the **Auth Test Panel** (bottom left corner):
```
Context State:
• Status: Authenticated
• User: your-email@gmail.com  
• Token: None                 ← THIS IS THE PROBLEM
• Profile Complete: true

localStorage:
• token: None                 ← SHOULD HAVE A TOKEN
• user: EXISTS
• isAuth: true
• isSignUp2: true
```

#### Step 2: Use Debugging Tools

**Auth Flow Debugger** (top right corner):
- Shows real-time authentication logs
- Displays state consistency checks
- Identifies specific issues

**Test Buttons Available:**
- `🧪 Test Google Login` - Simulates Google login flow
- `🧪 Test Token Persistence` - Tests if tokens survive page reloads
- `🔧 Fix Google Auth` - Manually fixes missing token issues
- `Fix Auth State` - General authentication state repair

#### Step 3: Monitor Console Logs

Open Developer Tools (F12) and watch for these log patterns:

**Successful Google Login:**
```
🔵 Processing Google login...
🔵 Google login result: {success: true, hasToken: true, hasUser: true}
🔵 Google auth data: {tokenExists: true, userData: {...}}
🔵 Storing Google token: eyJhbGciOiJIUzI1NiI...
🔵 Google login successful, profile complete
```

**Problematic Google Login:**
```
🔵 Processing Google login...
🔵 Google login result: {success: true, hasToken: false, hasUser: true}  ← NO TOKEN
⚠️ No token received from Google login
🔵 Google login successful, profile complete
```

#### Step 4: Backend Response Analysis

The issue typically occurs when the backend `/users/google-signup/` endpoint returns:
```json
{
  "success": true,
  "user": {...},
  "token": null  // ← Missing or undefined token
}
```

**Expected response:**
```json
{
  "success": true,
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Root Cause Analysis

1. **Backend Issue**: Google signup endpoint not returning JWT token
2. **Network Issue**: Token lost during API response transmission  
3. **Frontend Issue**: Token not being properly extracted from response

### Verification Steps

After using "🔧 Fix Google Auth":

1. **Check Auth Test Panel** - Should show:
   - Status: Authenticated ✅
   - User: your-email@gmail.com ✅
   - Token: eyJhbGci... ✅
   - Profile Complete: true ✅

2. **Test Page Reload** - Authentication should persist

3. **Check localStorage** in DevTools:
   ```javascript
   localStorage.getItem('token')        // Should return JWT token
   localStorage.getItem('currentUser')  // Should return user object
   localStorage.getItem('isAuthenticated') // Should be 'true'
   ```

### Prevention

To prevent this issue in the future:

1. **Backend**: Ensure Google signup always returns a JWT token
2. **Frontend**: Add more robust error handling for missing tokens
3. **Testing**: Use the provided test tools regularly

### Manual Recovery

If debug tools aren't available:

```javascript
// In browser console:
const user = JSON.parse(localStorage.getItem('currentUser'));
const token = 'manual-fix-' + Date.now();
localStorage.setItem('token', token);
localStorage.setItem('isAuthenticated', 'true');
window.location.reload();
```

### Testing Commands

```javascript
// Test current auth state
console.log('Auth State:', {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('currentUser')),
  isAuth: localStorage.getItem('isAuthenticated')
});

// Clear all auth data
localStorage.removeItem('token');
localStorage.removeItem('currentUser'); 
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('isSignUp2');
window.location.reload();
```

### Debug Component Locations

- **Auth Test Panel**: Bottom left corner
- **Token Status**: Top left corner  
- **Auth Flow Debugger**: Top right corner
- **Auth Debugger**: Check browser console

All debug components are automatically hidden in production builds.
