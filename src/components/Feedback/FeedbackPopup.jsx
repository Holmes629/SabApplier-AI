import React, { useEffect, useState } from 'react';

export default function FeedbackPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 60000); // 60 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      right: 32,
      background: 'white',
      border: '1px solid #2563eb',
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      padding: 20,
      zIndex: 1001,
      minWidth: 260,
      maxWidth: 320,
    }}>
      <div style={{ marginBottom: 12, fontWeight: 500, color: '#222' }}>
        Enjoying the site? We’d love your feedback!
      </div>
      <a
        href="https://forms.gle/LF873a6PqVE9sNmQ9"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Give Feedback
      </a>
      <button
        onClick={() => setShow(false)}
        style={{
          marginLeft: 12,
          background: 'none',
          border: 'none',
          color: '#888',
          cursor: 'pointer',
          fontSize: 20,
          position: 'absolute',
          top: 8,
          right: 12,
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
} 