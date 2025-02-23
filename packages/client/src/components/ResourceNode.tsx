import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Html } from '@react-three/drei';
import { SkillType, useSkillsStore } from '../store/skillsStore';
import { useGameStore } from '../store/gameStore';
import { XPPopup } from './XPPopup';
import './ResourceNode.css';

export enum ResourceType {
  TREE = 'TREE',
  ROCK = 'ROCK',
  GOLD_ROCK = 'GOLD_ROCK',
}

interface ResourceNodeProps {
  type: ResourceType;
  position: { x: number; y: number; z: number };
  id: string;
}

const GATHER_TIME = 2000; // 2 seconds to gather
const RESPAWN_TIME = 10000; // 10 seconds
const INTERACTION_DISTANCE = 2;
const BASE_XP = {
  [ResourceType.TREE]: 25,
  [ResourceType.ROCK]: 50,
  [ResourceType.GOLD_ROCK]: 1500, // 30x normal rock XP
};
const COLLISION_RADIUS = 0.6;

export function ResourceNode({ type, position, id }: ResourceNodeProps) {
  const [depleted, setDepleted] = useState(false);
  const [gatherProgress, setGatherProgress] = useState(0);
  const [isGathering, setIsGathering] = useState(false);
  const [xpPopup, setXpPopup] = useState<{ amount: number } | null>(null);
  const [levelUpPopup, setLevelUpPopup] = useState<{ level: number } | null>(null);
  const respawnTimer = useRef<NodeJS.Timeout | null>(null);
  const gatherTimer = useRef<NodeJS.Timeout | null>(null);
  const { addExperience, getLevel } = useSkillsStore();
  const currentPlayer = useGameStore(state => 
    state.room ? state.players.get(state.room.sessionId) : null
  );

  // Handle gathering progress
  useEffect(() => {
    if (isGathering && !depleted) {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / GATHER_TIME);
        setGatherProgress(progress);

        if (progress < 1) {
          gatherTimer.current = setTimeout(updateProgress, 10);
        } else {
          completeGathering();
        }
      };
      gatherTimer.current = setTimeout(updateProgress, 10);
    }

    return () => {
      if (gatherTimer.current) {
        clearTimeout(gatherTimer.current);
        gatherTimer.current = null;
      }
    };
  }, [isGathering]);

  const startGathering = () => {
    if (depleted || !currentPlayer) return;

    const dx = currentPlayer.x - position.x;
    const dy = currentPlayer.y - position.z;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > INTERACTION_DISTANCE) {
      console.log('Too far to interact');
      return;
    }

    setIsGathering(true);
  };

  const stopGathering = () => {
    setIsGathering(false);
    setGatherProgress(0);
    if (gatherTimer.current) {
      clearTimeout(gatherTimer.current);
      gatherTimer.current = null;
    }
  };

  const completeGathering = () => {
    setIsGathering(false);
    setGatherProgress(0);

    const skillType = type === ResourceType.TREE ? SkillType.WOODCUTTING : SkillType.MINING;
    const playerLevel = getLevel(skillType);
    
    // Success chance increases with level
    const successChance = 0.3 + (playerLevel * 0.01);
    if (Math.random() < successChance) {
      // Add experience based on level and resource type
      const baseXP = BASE_XP[type];
      const xpGain = baseXP * (1 + Math.floor(playerLevel / 10));
      const oldLevel = playerLevel;
      addExperience(skillType, xpGain);
      const newLevel = getLevel(skillType);
      
      // Show XP popup
      setXpPopup({ amount: xpGain });
      
      // Show level up popup if leveled up
      if (newLevel > oldLevel) {
        setLevelUpPopup({ level: newLevel });
        // Clear level up popup after 3 seconds
        setTimeout(() => setLevelUpPopup(null), 3000);
      }
      
      // Deplete the resource
      setDepleted(true);
      
      // Set respawn timer
      respawnTimer.current = setTimeout(() => {
        setDepleted(false);
      }, RESPAWN_TIME);
    }
  };

  // Handle key events for gathering
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        startGathering();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        stopGathering();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentPlayer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (respawnTimer.current) {
        clearTimeout(respawnTimer.current);
      }
      if (gatherTimer.current) {
        clearTimeout(gatherTimer.current);
      }
    };
  }, []);

  // Progress bar component
  const ProgressBar = () => {
    if (!isGathering || depleted) return null;
    return (
      <Html position={[0, 2, 0]} center>
        <div style={{
          width: '100px',
          height: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #2ecc71',
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${gatherProgress * 100}%`,
            height: '100%',
            background: '#2ecc71',
            transition: 'width 0.1s linear',
          }} />
        </div>
      </Html>
    );
  };

  const renderNode = () => {
    if (type === ResourceType.TREE) {
      return (
        <group 
          position={[position.x, position.y, position.z]} 
          onPointerDown={startGathering}
          onPointerUp={stopGathering}
          onPointerLeave={stopGathering}
        >
          <ProgressBar />
          {/* Tree trunk */}
          <Cylinder 
            args={[0.2, 0.3, 1.5, 8]} 
            position={[0, 0.75, 0]}
          >
            <meshStandardMaterial 
              color={depleted ? '#8b4513' : '#654321'} 
            />
          </Cylinder>
          {/* Tree top */}
          <group position={[0, 1.5, 0]}>
            <Box args={[1, 1, 1]}>
              <meshStandardMaterial 
                color={depleted ? '#2f4f2f' : '#228b22'} 
              />
            </Box>
          </group>
        </group>
      );
    }

    // Rock or Gold Rock
    const isGoldRock = type === ResourceType.GOLD_ROCK;
    return (
      <group 
        position={[position.x, position.y, position.z]}
        onPointerDown={startGathering}
        onPointerUp={stopGathering}
        onPointerLeave={stopGathering}
      >
        <ProgressBar />
        <Box 
          args={[1, 0.8, 1]}
          position={[0, 0.4, 0]}
        >
          <meshStandardMaterial 
            color={depleted 
              ? (isGoldRock ? '#8B7355' : '#696969')
              : (isGoldRock ? '#FFD700' : '#808080')
            }
            metalness={isGoldRock ? 0.8 : 0}
            roughness={isGoldRock ? 0.2 : 0.8}
          />
        </Box>
      </group>
    );
  };

  return (
    <>
      {renderNode()}
      {xpPopup && (
        <XPPopup
          amount={xpPopup.amount}
          position={position}
          onComplete={() => setXpPopup(null)}
        />
      )}
      {levelUpPopup && (
        <Html position={[position.x, position.y + 3, position.z]} center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#2ecc71',
            padding: '10px 20px',
            borderRadius: '4px',
            border: '1px solid #2ecc71',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(46, 204, 113, 0.5)',
            animation: 'levelUp 0.5s ease-out',
          }}>
            Level Up! {levelUpPopup.level}
          </div>
        </Html>
      )}
    </>
  );
} 