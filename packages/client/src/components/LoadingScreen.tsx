import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinished?: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onFinished, minDuration = 1500 }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [canHide, setCanHide] = useState(false);

  useEffect(() => {
    // Set minimum duration timer
    const timer = setTimeout(() => {
      setCanHide(true);
      if (onFinished) {
        onFinished();
      }
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinished]);

  useEffect(() => {
    // If we can hide, start fade out animation
    if (canHide) {
      setIsVisible(false);
    }
  }, [canHide]);

  if (!isVisible && !canHide) return null;

  return (
    <div className={`loading-overlay ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loading-container">
        <div className="loading-logo">HABX</div>
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>

      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #2c1447 0%, #6b1b8c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          opacity: 1;
          transition: opacity 0.5s ease;
        }

        .loading-overlay.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          animation: pulse 2s infinite;
        }

        .loading-logo {
          color: var(--color-text);
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: var(--shadow-glow);
          letter-spacing: 4px;
          animation: glitch 2s infinite;
        }

        .loading-spinner {
          width: 64px;
          height: 64px;
          position: relative;
          animation: rotate 2s linear infinite;
        }

        .loading-spinner:before,
        .loading-spinner:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 4px solid transparent;
          border-radius: 8px;
        }

        .loading-spinner:before {
          border-color: var(--color-primary);
          animation: pulse 2s infinite;
        }

        .loading-spinner:after {
          border-color: var(--color-secondary);
          animation: pulse 2s infinite reverse;
        }

        .loading-text {
          color: var(--color-text);
          font-size: 1rem;
          letter-spacing: 2px;
          position: relative;
        }

        .loading-text:after {
          content: '';
          position: absolute;
          display: inline-block;
          animation: dots 1.5s steps(4, jump-none) infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes dots {
          0% { content: '   '; }
          25% { content: '.  '; }
          50% { content: '.. '; }
          75% { content: '...'; }
          100% { content: '   '; }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
} 