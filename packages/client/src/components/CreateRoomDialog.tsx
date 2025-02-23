import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface CreateRoomDialogProps {
  onClose: () => void;
}

const ROOM_TEMPLATES = [
  { id: 'cafe', name: 'Cafe Room', description: 'Cozy cafe environment', icon: '☕' },
  { id: 'club', name: 'Club Room', description: 'Party atmosphere', icon: '🎵' },
];

export function CreateRoomDialog({ onClose }: CreateRoomDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [roomName, setRoomName] = useState('');
  const { createCustomRoom, connecting } = useGameStore();

  const handleCreate = async () => {
    if (!selectedTemplate || !roomName.trim()) return;
    await createCustomRoom(selectedTemplate, roomName.trim());
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-container" onClick={e => e.stopPropagation()}>
        <h2>Create Custom Room</h2>
        
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

        <div className="template-grid">
          {ROOM_TEMPLATES.map(template => (
            <button
              key={template.id}
              className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="template-icon">{template.icon}</div>
              <div className="template-content">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="dialog-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-button"
            onClick={handleCreate}
            disabled={!selectedTemplate || !roomName.trim() || connecting}
          >
            Create Room
          </button>
        </div>

        <style>{`
          .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }

          .dialog-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 24px;
            min-width: 320px;
            max-width: 480px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          h2 {
            color: white;
            margin: 0 0 1.5rem;
            font-size: 1.8rem;
            text-align: center;
          }

          .input-group {
            margin-bottom: 1.5rem;
          }

          label {
            display: block;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.5rem;
          }

          input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 1rem;
          }

          input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.4);
          }

          .template-grid {
            display: grid;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .template-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 12px;
            cursor: pointer;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.3s ease;
          }

          .template-card:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }

          .template-card.selected {
            background: rgba(46, 204, 113, 0.2);
            border-color: rgba(46, 204, 113, 0.4);
          }

          .template-icon {
            font-size: 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
          }

          .template-content h3 {
            color: white;
            margin: 0;
            font-size: 1rem;
          }

          .template-content p {
            color: rgba(255, 255, 255, 0.7);
            margin: 0.25rem 0 0;
            font-size: 0.9rem;
          }

          .dialog-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
          }

          .cancel-button,
          .create-button {
            flex: 1;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .cancel-button {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .cancel-button:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .create-button {
            background: rgba(46, 204, 113, 0.6);
            color: white;
          }

          .create-button:hover:not(:disabled) {
            background: rgba(46, 204, 113, 0.8);
          }

          .create-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
} 