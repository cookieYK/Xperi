import React from 'react';

interface InGameMenuProps {
  onExit: () => void;
}

export function InGameMenu({ onExit }: InGameMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) {
    return (
      <div className="menu-button-container">
        <button 
          className="menu-button"
          onClick={() => setIsOpen(true)}
        >
          <div className="menu-button-inner">
            <div className="menu-button-border"></div>
            <span className="menu-icon">▼</span>
            <span className="menu-text">Menu</span>
          </div>
        </button>

        <style>{`
          .menu-button-container {
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 100;
          }

          .menu-button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            position: relative;
            width: 120px;
            height: 40px;
            transform-style: preserve-3d;
            transition: transform 0.2s ease;
            image-rendering: pixelated;
          }

          .menu-button:hover {
            transform: translateY(2px);
          }

          .menu-button-inner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1a1a;
            border: 2px solid var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-family: var(--font-pixel);
            color: var(--color-primary);
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
            box-shadow: 0 0 10px rgba(46, 204, 113, 0.3);
            clip-path: polygon(
              4px 0,
              calc(100% - 4px) 0,
              100% 4px,
              100% calc(100% - 4px),
              calc(100% - 4px) 100%,
              4px 100%,
              0 calc(100% - 4px),
              0 4px
            );
          }

          .menu-button-inner::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            background: linear-gradient(
              45deg,
              rgba(46, 204, 113, 0.1) 0%,
              rgba(46, 204, 113, 0.2) 50%,
              rgba(46, 204, 113, 0.1) 100%
            );
            clip-path: polygon(
              3px 0,
              calc(100% - 3px) 0,
              100% 3px,
              100% calc(100% - 3px),
              calc(100% - 3px) 100%,
              3px 100%,
              0 calc(100% - 3px),
              0 3px
            );
            z-index: -1;
          }

          .menu-button-border {
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            border: 1px solid rgba(46, 204, 113, 0.3);
            clip-path: polygon(
              2px 0,
              calc(100% - 2px) 0,
              100% 2px,
              100% calc(100% - 2px),
              calc(100% - 2px) 100%,
              2px 100%,
              0 calc(100% - 2px),
              0 2px
            );
          }

          .menu-icon {
            font-size: 0.7rem;
            color: var(--color-primary);
          }

          .menu-text {
            transform: translateY(-1px);
          }

          .menu-button:active .menu-button-inner {
            transform: translateY(2px);
            box-shadow: 0 0 5px rgba(46, 204, 113, 0.2);
          }

          .menu-button:hover .menu-button-inner {
            box-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ingame-menu-overlay" onClick={() => setIsOpen(false)}>
      <div className="ingame-menu-container" onClick={e => e.stopPropagation()}>
        <div className="menu-header">Game Menu</div>
        <button 
          className="exit-button"
          onClick={() => {
            onExit();
            setIsOpen(false);
          }}
        >
          Exit Game
        </button>
      </div>

      <style>{`
        .ingame-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .ingame-menu-container {
          background: rgba(0, 0, 0, 0.9);
          padding: 2rem;
          border-radius: 4px;
          min-width: 300px;
          border: 2px solid var(--color-primary);
          animation: slideIn 0.2s ease;
          box-shadow: 0 0 20px rgba(46, 204, 113, 0.2);
        }

        .menu-header {
          color: var(--color-primary);
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 10px var(--color-primary);
        }

        .exit-button {
          width: 100%;
          padding: 1rem;
          background: var(--color-danger);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-pixel);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          clip-path: polygon(
            4px 0,
            calc(100% - 4px) 0,
            100% 4px,
            100% calc(100% - 4px),
            calc(100% - 4px) 100%,
            4px 100%,
            0 calc(100% - 4px),
            0 4px
          );
        }

        .exit-button:hover {
          background: #ff0000;
          transform: translateY(2px);
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 