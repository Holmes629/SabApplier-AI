import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingFeedbackButton() {
  return (
    <a
      href="https://forms.gle/LF873a6PqVE9sNmQ9"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: '#2563eb',
        color: 'white',
        borderRadius: 9999,
        minWidth: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        fontSize: 18,
        padding: '0 20px',
        fontWeight: 500,
        gap: 10,
        transition: 'background 0.2s',
      }}
      title="Give Feedback"
    >
      <MessageCircle size={24} />
      <span className="hidden sm:inline" style={{ marginLeft: 8, fontSize: 16, fontWeight: 600, letterSpacing: 0.2 }}>Feedback</span>
    </a>
  );
} 