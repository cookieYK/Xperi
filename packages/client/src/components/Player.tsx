import React from 'react';
import { Box } from '@react-three/drei';
import { Html } from '@react-three/drei';

interface PlayerProps {
  position: { x: number; y: number; z: number };
  isCurrentPlayer: boolean;
  username?: string;
  rotation?: number;
}

export function Player({ position, isCurrentPlayer, username, rotation = 0 }: PlayerProps) {
  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, rotation, 0]}>
      {/* Username label */}
      <Html
        position={[0, 1.5, 0]}
        center
        style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '4px 8px',
          borderRadius: '4px',
          color: isCurrentPlayer ? '#2ecc71' : 'white',
          fontSize: '14px',
          fontFamily: 'var(--font-pixel)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {username || 'Player'}
      </Html>

      {/* Player body */}
      <Box
        args={[0.8, 1, 0.8]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={isCurrentPlayer ? '#2ecc71' : '#e74c3c'} 
          roughness={0.5}
          metalness={0.5}
        />
      </Box>

      {/* Player direction indicator */}
      <Box
        args={[0.3, 0.1, 0.4]}
        position={[0, 0.5, -0.5]}
        castShadow
      >
        <meshStandardMaterial
          color={isCurrentPlayer ? '#1abc9c' : '#c0392b'}
          roughness={0.5}
          metalness={0.5}
        />
      </Box>
      
      {/* Player highlight ring */}
      {isCurrentPlayer && (
        <mesh
          position={[0, -0.49, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color="#2ecc71" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
} 