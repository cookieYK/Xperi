import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

interface ChatBubbleProps {
  message: string;
  position: [number, number, number];
}

export function ChatBubble({ message, position }: ChatBubbleProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, [message]);

  if (!visible || !message) return null;

  return (
    <Html
      position={position}
      center
      style={{
        background: 'rgba(0,0,0,0.7)',
        padding: '4px 8px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '12px',
        fontFamily: 'var(--font-pixel)',
        whiteSpace: 'pre-wrap',
        maxWidth: '150px',
        textAlign: 'center',
        transform: 'scale(1)',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {message}
    </Html>
  );
} 