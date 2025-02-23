import React, { useEffect, useRef } from 'react';

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: number;
}

interface ChatLogProps {
  messages: ChatMessage[];
}

export function ChatLog({ messages }: ChatLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-log" ref={logRef}>
        {messages.map((msg, index) => (
          <div 
            key={`${msg.timestamp}-${index}`} 
            className={`chat-message ${msg.sender === 'System' ? 'system' : ''}`}
          >
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
            <span className="sender">{msg.sender}:</span>
            <span className="content">{msg.content}</span>
          </div>
        ))}
      </div>

      <style>{`
        .chat-container {
          position: fixed;
          left: 20px;
          top: 20px;
          width: 300px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
          border: 1px solid rgba(46, 204, 113, 0.3);
          overflow: hidden;
          font-family: var(--font-pixel);
        }

        .chat-log {
          height: 200px;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-message {
          color: white;
          font-size: 12px;
          line-height: 1.4;
          animation: fadeIn 0.3s ease;
        }

        .chat-message.system {
          color: #2ecc71;
          font-style: italic;
        }

        .timestamp {
          color: rgba(255, 255, 255, 0.5);
          margin-right: 8px;
          font-size: 10px;
        }

        .sender {
          color: #3498db;
          margin-right: 8px;
        }

        .content {
          color: rgba(255, 255, 255, 0.9);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Custom scrollbar */
        .chat-log::-webkit-scrollbar {
          width: 6px;
        }

        .chat-log::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .chat-log::-webkit-scrollbar-thumb {
          background: rgba(46, 204, 113, 0.5);
          border-radius: 3px;
        }

        .chat-log::-webkit-scrollbar-thumb:hover {
          background: rgba(46, 204, 113, 0.7);
        }
      `}</style>
    </div>
  );
} 