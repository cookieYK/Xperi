import React from 'react';
import { Plane, Grid } from '@react-three/drei';

interface IsometricGridProps {
  size: number;
}

export function IsometricGrid({ size }: IsometricGridProps) {
  return (
    <group>
      <Plane 
        args={[size, size]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[size/2, 0, size/2]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#2c3e50" 
          roughness={0.8}
          metalness={0.2}
        />
      </Plane>
      <Grid
        position={[size/2, 0.01, size/2]}
        args={[size, size]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3498db"
        sectionSize={1}
        fadeDistance={30}
        fadeStrength={1}
      />
    </group>
  );
} 