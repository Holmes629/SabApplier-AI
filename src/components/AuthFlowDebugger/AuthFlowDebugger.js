import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthFlowDebugger = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Capture console logs related to auth
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const captureLog = (level, ...args) => {
      const message = args.join(' ');
      // Only capture auth-related logs
      if (message.includes('🔵') || message.includes('✅') || message.includes('❌') || 
          message.includes('⚠️') || message.includes('auth') || message.includes('token') ||
          message.includes('Google') || message.includes('login')) {
        
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-19), { // Keep last 20 logs
          level,
          message,
          timestamp,
          id: Date.now() + Math.random()
        }]);
      }
    };

    console.log = (...args) => {
      originalConsoleLog(...args);
      captureLog('log', ...args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      captureLog('error', ...args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      captureLog('warn', ...args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getCurrentAuthState = () => {
    return {
      context: {
        user: user ? { email: user.email, id: user.id } : null,
        token: token ? `${token.substring(0, 20)}...` : null,
        isAuthenticated,
        isLoading
      },
      localStorage: {
        token: localStorage.getItem('token') ? 
          `${localStorage.getItem('token').substring(0, 20)}...` : null,
        currentUser: localStorage.getItem('currentUser') ? 
          JSON.parse(localStorage.getItem('currentUser')).email : null,
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        isSignUp2: localStorage.getItem('isSignUp2')
      },
      consistency: {
        tokenMatch: (!!token) === (!!localStorage.getItem('token')),
        userMatch: (!!user) === (!!localStorage.getItem('currentUser')),
        authMatch: isAuthenticated === (localStorage.getItem('isAuthenticated') === 'true')
      }
    };
  };

  const logLevelColors = {
    log: 'text-gray-700',
    error: 'text-red-600',
    warn: 'text-orange-600'
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-w-md">
      <div 
        className="p-3 cursor-pointer border-b bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm">🔍 Auth Flow Debugger</h3>
          <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'} 
          {token ? ' | Token: OK' : ' | No Token'}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 max-h-96 overflow-y-auto">
          {/* Current State */}
          <div className="mb-4">
            <h4 className="font-semibold text-xs mb-2">Current State:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(getCurrentAuthState(), null, 2)}
            </pre>
          </div>

          {/* Authentication Issues Detection */}
          <div className="mb-4">
            <h4 className="font-semibold text-xs mb-2">Issues Detected:</h4>
            <div className="space-y-1 text-xs">
              {user && !token && (
                <div className="text-red-600">⚠️ User exists but no token</div>
              )}
              {token && !user && (
                <div className="text-red-600">⚠️ Token exists but no user</div>
              )}
              {localStorage.getItem('token') && !token && (
                <div className="text-orange-600">⚠️ Token in storage but not in context</div>
              )}
              {localStorage.getItem('currentUser') && !user && (
                <div className="text-orange-600">⚠️ User in storage but not in context</div>
              )}
              {user && token && isAuthenticated && (
                <div className="text-green-600">✅ Auth state looks good</div>
              )}
            </div>
          </div>

          {/* Logs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-xs">Auth Logs:</h4>
              <button 
                onClick={clearLogs}
                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto bg-gray-50 p-2 rounded">
              {logs.length === 0 ? (
                <div className="text-xs text-gray-500">No auth logs yet...</div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={`text-xs ${logLevelColors[log.level]}`}>
                    <span className="text-gray-400">{log.timestamp}</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthFlowDebugger;
