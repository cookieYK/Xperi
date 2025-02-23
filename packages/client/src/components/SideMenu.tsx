import React from 'react';
import { useGameStore } from '../store/gameStore';

interface SideMenuProps {
  type: 'join' | 'browse' | 'create';
  onClose: () => void;
  onAction: (action: string, data?: any) => void;
}

export function SideMenu({ type, onClose, onAction }: SideMenuProps) {
  const { availableRooms } = useGameStore();
  const [roomName, setRoomName] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState('');

  const renderContent = () => {
    switch (type) {
      case 'join':
        return (
          <div className="side-menu-content">
            <h2>Join Game</h2>
            <p>Choose where to start:</p>
            <button 
              className="action-button primary"
              onClick={() => onAction('joinLobby')}
            >
              Join Main Lobby
            </button>
            <button 
              className="action-button"
              onClick={() => onAction('browse')}
            >
              Browse All Rooms
            </button>
          </div>
        );

      case 'browse':
        return (
          <div className="side-menu-content">
            <h2>Current Rooms</h2>
            <div className="room-list">
              {availableRooms.map(room => (
                <button
                  key={room.roomId}
                  className="room-item"
                  onClick={() => onAction('joinRoom', room.roomId)}
                >
                  <div className="room-icon">
                    {room.metadata?.template === 'cafe' ? '☕' : 
                     room.metadata?.template === 'club' ? '🎵' : '🎮'}
                  </div>
                  <div className="room-info">
                    <h3>{room.metadata?.name || room.roomId}</h3>
                    <p>{room.clients} / {room.maxClients} players</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'create':
        return (
          <div className="side-menu-content">
            <h2>Create Room</h2>
            <div className="input-group">
              <label>Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                maxLength={20}
              />
            </div>
            <div className="template-list">
              <button
                className={`template-item ${selectedTemplate === 'cafe' ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate('cafe')}
              >
                <div className="template-icon">☕</div>
                <div className="template-info">
                  <h3>Cafe Room</h3>
                  <p>Cozy cafe environment</p>
                </div>
              </button>
              <button
                className={`template-item ${selectedTemplate === 'club' ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate('club')}
              >
                <div className="template-icon">🎵</div>
                <div className="template-info">
                  <h3>Club Room</h3>
                  <p>Party atmosphere</p>
                </div>
              </button>
            </div>
            <button
              className="action-button primary"
              disabled={!selectedTemplate || !roomName.trim()}
              onClick={() => onAction('createRoom', { template: selectedTemplate, name: roomName })}
            >
              Create Room
            </button>
          </div>
        );
    }
  };

  return (
    <div className="side-menu-overlay" onClick={onClose}>
      <div className="side-menu" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        {renderContent()}
      </div>

      <style>{`
        .side-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: flex-end;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .side-menu {
          width: 400px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          height: 100%;
          padding: 2rem;
          position: relative;
          animation: slideIn 0.3s ease;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .close-button:hover {
          opacity: 1;
        }

        .side-menu-content {
          height: 100%;
          overflow-y: auto;
        }

        h2 {
          color: white;
          margin: 0 0 1.5rem;
          font-size: 1.8rem;
        }

        p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
        }

        .action-button {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transition: all 0.3s ease;
        }

        .action-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .action-button.primary {
          background: rgba(46, 204, 113, 0.6);
        }

        .action-button.primary:hover:not(:disabled) {
          background: rgba(46, 204, 113, 0.8);
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .room-list, .template-list {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .room-item, .template-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .room-item:hover, .template-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .template-item.selected {
          background: rgba(46, 204, 113, 0.2);
          border-color: rgba(46, 204, 113, 0.4);
        }

        .room-icon, .template-icon {
          font-size: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .room-info h3, .template-info h3 {
          color: white;
          margin: 0;
          font-size: 1rem;
        }

        .room-info p, .template-info p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
        }

        .input-group input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }

        .input-group input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
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