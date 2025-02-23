import React, { useEffect, useState, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { Player } from './Player';
import { IsometricGrid } from './IsometricGrid';
import { ChatLog } from './ChatLog';
import { ChatBubble } from './ChatBubble';
import { ResourceNode, ResourceType } from './ResourceNode';
import { SkillsPanel } from './SkillsPanel';

const DEFAULT_CONFIG = {
  cameraPosition: [20, 20, 20] as [number, number, number],
  gridSize: 20,
  controlsTarget: [10, 0, 10] as [number, number, number]
};

// Movement constants
const MOVE_SPEED = 0.5; // Increased for more responsive movement
const DIAGONAL_SPEED = MOVE_SPEED * 0.707; // Normalize diagonal movement speed

// Add after DEFAULT_CONFIG
export const RESOURCE_NODES = [
  // Trees - Forest Area
  { id: 'tree1', type: ResourceType.TREE, position: { x: 5, y: 0, z: 5 } },
  { id: 'tree2', type: ResourceType.TREE, position: { x: 15, y: 0, z: 5 } },
  { id: 'tree3', type: ResourceType.TREE, position: { x: 5, y: 0, z: 15 } },
  { id: 'tree4', type: ResourceType.TREE, position: { x: 15, y: 0, z: 15 } },
  { id: 'tree5', type: ResourceType.TREE, position: { x: 4, y: 0, z: 4 } },
  { id: 'tree6', type: ResourceType.TREE, position: { x: 6, y: 0, z: 4 } },
  { id: 'tree7', type: ResourceType.TREE, position: { x: 4, y: 0, z: 6 } },
  { id: 'tree8', type: ResourceType.TREE, position: { x: 14, y: 0, z: 4 } },
  { id: 'tree9', type: ResourceType.TREE, position: { x: 16, y: 0, z: 4 } },
  { id: 'tree10', type: ResourceType.TREE, position: { x: 14, y: 0, z: 6 } },
  
  // Rocks - Mining Area
  { id: 'rock1', type: ResourceType.ROCK, position: { x: 10, y: 0, z: 5 } },
  { id: 'rock2', type: ResourceType.ROCK, position: { x: 5, y: 0, z: 10 } },
  { id: 'rock3', type: ResourceType.ROCK, position: { x: 15, y: 0, z: 10 } },
  { id: 'rock4', type: ResourceType.ROCK, position: { x: 10, y: 0, z: 15 } },
  { id: 'rock5', type: ResourceType.ROCK, position: { x: 9, y: 0, z: 4 } },
  { id: 'rock6', type: ResourceType.ROCK, position: { x: 11, y: 0, z: 4 } },
  { id: 'rock7', type: ResourceType.ROCK, position: { x: 9, y: 0, z: 6 } },
  { id: 'rock8', type: ResourceType.ROCK, position: { x: 11, y: 0, z: 6 } },
  { id: 'rock9', type: ResourceType.ROCK, position: { x: 4, y: 0, z: 9 } },
  { id: 'rock10', type: ResourceType.ROCK, position: { x: 4, y: 0, z: 11 } },

  // Gold Rocks - Special Mining Area
  { id: 'gold1', type: ResourceType.GOLD_ROCK, position: { x: 18, y: 0, z: 18 } },
  { id: 'gold2', type: ResourceType.GOLD_ROCK, position: { x: 17, y: 0, z: 18 } },
  { id: 'gold3', type: ResourceType.GOLD_ROCK, position: { x: 18, y: 0, z: 17 } },
];

export function Game() {
  const { disconnect, players, room, movePlayer, messages, sendChat, gridSize } = useGameStore();
  const [chatInput, setChatInput] = useState('');
  const currentPlayerId = room?.sessionId;
  const currentPlayer = currentPlayerId ? players.get(currentPlayerId) : null;
  const activeKeys = useRef(new Set<string>());
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const updateMovement = () => {
      if (!currentPlayer) return;

      let dx = 0;
      let dy = 0;

      // Calculate movement based on currently held keys
      if (activeKeys.current.has('w') || activeKeys.current.has('arrowup')) dy -= 1;
      if (activeKeys.current.has('s') || activeKeys.current.has('arrowdown')) dy += 1;
      if (activeKeys.current.has('a') || activeKeys.current.has('arrowleft')) dx -= 1;
      if (activeKeys.current.has('d') || activeKeys.current.has('arrowright')) dx += 1;

      // If moving diagonally, normalize the speed
      if (dx !== 0 || dy !== 0) {
        const speed = (dx !== 0 && dy !== 0) ? DIAGONAL_SPEED : MOVE_SPEED;
        
        // Calculate new position
        const newX = Math.max(0, Math.min(gridSize, currentPlayer.x + dx * speed));
        const newY = Math.max(0, Math.min(gridSize, currentPlayer.y + dy * speed));

        // Only send movement if position actually changes
        if (Math.abs(newX - currentPlayer.x) > 0.001 || Math.abs(newY - currentPlayer.y) > 0.001) {
          console.log('Moving to:', { newX, newY, dx, dy, speed });
          movePlayer(newX, newY);
        }
      }

      // Always continue the animation loop while any key is pressed
      if (activeKeys.current.size > 0) {
        animationFrameId.current = requestAnimationFrame(updateMovement);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      
      const key = e.key.toLowerCase();
      if (!['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) return;

      e.preventDefault();
      activeKeys.current.add(key);

      // Start the animation loop if it's not running
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(updateMovement);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      activeKeys.current.delete(key);

      // Only stop the animation loop if no keys are pressed
      if (activeKeys.current.size === 0 && animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined;
      }
    };
  }, [currentPlayer, movePlayer, gridSize]);

  const handleChatSubmit = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chatInput.trim()) {
      sendChat(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="game-container">
      <Canvas
        camera={{
          position: DEFAULT_CONFIG.cameraPosition,
          fov: 50,
          near: 0.1,
          far: 1000,
          up: [0, 1, 0],
        }}
      >
        <OrbitControls
          target={DEFAULT_CONFIG.controlsTarget}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={15}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 4}
          domElement={document.body}
          enableZoom={true}
        />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
        <IsometricGrid size={DEFAULT_CONFIG.gridSize} />
        
        {RESOURCE_NODES.map((node) => (
          <ResourceNode
            key={node.id}
            id={node.id}
            type={node.type}
            position={node.position}
          />
        ))}
        
        {Array.from(players.entries()).map(([id, player]) => (
          <group key={id}>
            <Player
              position={{
                x: player.x,
                y: 0.5,
                z: player.y
              }}
              isCurrentPlayer={id === currentPlayerId}
              username={player.username}
              rotation={player.rotation}
            />
            {player.lastChatMessage && Date.now() - (player.lastChatTime || 0) < 5000 && (
              <ChatBubble
                message={player.lastChatMessage}
                position={[player.x, 2, player.y]}
              />
            )}
          </group>
        ))}
      </Canvas>

      <SkillsPanel />

      <ChatLog messages={messages} />

      <div className="chat-input">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleChatSubmit}
          placeholder="Press Enter to chat..."
          maxLength={100}
        />
      </div>

      <button 
        className="exit-button"
        onClick={disconnect}
      >
        Exit Game
      </button>

      <div className="controls-help">
        <h3>Controls</h3>
        <p>WASD or Arrow Keys to move</p>
        <p>Left Click + Drag to rotate</p>
        <p>Right Click + Drag to pan</p>
        <p>Scroll to zoom</p>
        <p>Enter to chat</p>
        <p>E or Click to gather resources</p>
      </div>

      <style>{`
        .game-container {
          width: 100vw;
          height: 100vh;
          background: #1a1a1a;
          position: relative;
        }

        .chat-input {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
        }

        .chat-input input {
          width: 100%;
          padding: 12px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(46, 204, 113, 0.3);
          border-radius: 8px;
          color: white;
          font-family: var(--font-pixel);
          font-size: 14px;
        }

        .chat-input input:focus {
          outline: none;
          border-color: rgba(46, 204, 113, 0.6);
          box-shadow: 0 0 10px rgba(46, 204, 113, 0.2);
        }

        .exit-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .exit-button:hover {
          background: #c0392b;
          transform: translateY(-2px);
        }

        .controls-help {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          padding: 15px;
          border-radius: 8px;
          color: white;
          font-family: inherit;
        }

        .controls-help h3 {
          margin: 0 0 10px 0;
          color: #2ecc71;
        }

        .controls-help p {
          margin: 5px 0;
          font-size: 0.9em;
          color: #ecf0f1;
        }
      `}</style>
    </div>
  );
}