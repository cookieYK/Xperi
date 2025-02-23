import { Vector3 } from 'three';

export interface RoomConfig {
  name: string;
  cameraPosition: Vector3;
  gridSize: number;
  backgroundColor: string;
}

export const ROOM_CONFIGS: Record<string, RoomConfig> = {
  lobby: {
    name: 'Lobby',
    cameraPosition: new Vector3(10, 10, 10),
    gridSize: 10,
    backgroundColor: '#1a1a1a',
  },
  cafe: {
    name: 'Cafe',
    cameraPosition: new Vector3(12, 12, 12),
    gridSize: 12,
    backgroundColor: '#2c3e50',
  },
  club: {
    name: 'Club',
    cameraPosition: new Vector3(15, 15, 15),
    gridSize: 15,
    backgroundColor: '#2c3e50',
  },
}; 