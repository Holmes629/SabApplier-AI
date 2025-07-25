import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const defaultPosition = {
  bottom: 24,
  right: 24,
};

const floatingBaseStyle = {
  position: 'fixed',
  zIndex: 1000,
  background: 'transparent', // changed from #fff to transparent
  borderRadius: 20,
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  padding: '8px 8px 4px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  minWidth: 340,
  maxWidth: '95vw',
  transition: 'box-shadow 0.2s',
  cursor: 'grab',
};

const closeBtnStyle = {
  background: 'rgba(37,99,235,0.08)',
  border: 'none',
  borderRadius: 9999,
  cursor: 'pointer',
  padding: 4,
  marginBottom: 4,
  alignSelf: 'flex-end',
  transition: 'background 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2563eb',
};

const FloatingVideoDemo = () => {
  const [show, setShow] = useState(true);
  const [position, setPosition] = useState(defaultPosition);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Calculate style based on position (bottom/right or top/left)
  const style = {
    ...floatingBaseStyle,
    ...(position.top !== undefined ? { top: position.top } : { bottom: position.bottom }),
    ...(position.left !== undefined ? { left: position.left } : { right: position.right }),
    cursor: dragging ? 'grabbing' : 'grab',
    userSelect: 'none',
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setDragging(true);
    // Get current mouse and popup position
    const popup = e.currentTarget;
    const rect = popup.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    // Prevent text selection
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    // Calculate new position relative to viewport
    const newLeft = e.clientX - dragOffset.current.x;
    const newTop = e.clientY - dragOffset.current.y;
    setPosition({ top: Math.max(0, newTop), left: Math.max(0, newLeft) });
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  if (!show) return null;
  return createPortal(
    <div
      style={style}
      onMouseDown={handleMouseDown}
      title="Drag to move"
    >
      <button style={closeBtnStyle} onClick={() => setShow(false)} title="Close video demo">
        <X size={22} />
      </button>
      <iframe
        width="340"
        height="202"
        src="https://www.youtube.com/embed/ekW1cQOJHPw?mute=1"
        title="Product Demo Video"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ borderRadius: '12px', maxWidth: '100%' }}
      ></iframe>
    </div>,
    document.body
  );
};

export default FloatingVideoDemo; 