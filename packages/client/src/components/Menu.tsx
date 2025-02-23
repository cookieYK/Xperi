import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function Menu() {
  const [username, setUsername] = useState('');
  const { connect, connecting, error } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await connect(username);
  };

  return (
    <div className="menu-overlay">
      <div className="menu-container">
        <div className="logo">HABX</div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            disabled={connecting}
          />
          <button type="submit" disabled={connecting || !username.trim()}>
            {connecting ? 'Connecting...' : 'Join Game'}
          </button>
        </form>
      </div>

      <style>{`
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #2c1447 0%, #6b1b8c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .menu-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 12px;
          min-width: 320px;
          max-width: 480px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: slideIn 0.3s ease;
        }

        .logo {
          color: white;
          text-align: center;
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          letter-spacing: 4px;
        }

        .error-message {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          backdrop-filter: blur(5px);
          border: 2px solid #e74c3c;
          font-size: 0.9rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }

        button {
          width: 100%;
          padding: 1rem;
          background: rgba(46, 204, 113, 0.6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover:not(:disabled) {
          background: rgba(46, 204, 113, 0.8);
          transform: translateY(-2px);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
      `}</style>
    </div>
  );
} 