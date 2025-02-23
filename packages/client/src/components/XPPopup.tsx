import React, { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface XPPopupProps {
  amount: number;
  position: { x: number; y: number; z: number };
  onComplete: () => void;
}

export function XPPopup({ amount, position, onComplete }: XPPopupProps) {
  const startTime = useRef(Date.now());
  const yOffset = useRef(0);
  const opacity = useRef(1);
  const htmlRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const elapsed = Date.now() - startTime.current;
    const duration = 2000; // 2 seconds animation
    
    if (elapsed >= duration) {
      onComplete();
      return;
    }

    const progress = elapsed / duration;
    yOffset.current = progress * 2; // Float up 2 units
    opacity.current = 1 - progress;

    if (htmlRef.current) {
      htmlRef.current.style.opacity = opacity.current.toString();
    }
  });

  return (
    <Html position={[position.x, position.y + 2 + yOffset.current, position.z]} center>
      <div
        ref={htmlRef}
        style={{
          color: '#2ecc71',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontFamily: 'var(--font-pixel)',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          textShadow: '0 0 5px rgba(46, 204, 113, 0.5)',
          transform: 'scale(1)',
          transition: 'transform 0.2s ease',
          animation: 'popIn 0.2s ease-out',
        }}
      >
        +{amount} XP
      </div>
      <style>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Html>
  );
} 