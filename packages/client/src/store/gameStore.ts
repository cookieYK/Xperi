import { create } from 'zustand';
import { Client, Room } from 'colyseus.js';
import { RESOURCE_NODES } from '../components/Game';
import { ResourceType } from '../components/ResourceNode';

interface Player {
  x: number;
  y: number;
  username: string;
  rotation: number;
  targetX: number;
  targetY: number;
  lastChatMessage?: string;
  lastChatTime?: number;
}

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: number;
}

interface GameState {
  players: Map<string, Player>;
  messages: ChatMessage[];
  room: Room | null;
  client: Client | null;
  connecting: boolean;
  error: string | null;
  gridSize: number;
  // Actions
  connect: (username: string) => Promise<void>;
  disconnect: () => void;
  movePlayer: (x: number, y: number) => void;
  updatePositions: () => void;
  sendChat: (content: string) => void;
}

const GAME_SERVER = 'ws://localhost:3001';
const INTERPOLATION_SPEED = 0.2; // Slower interpolation for smoother movement
const PLAYER_RADIUS = 0.4;
const RESOURCE_RADIUS = 0.6;

// Helper function to check collision between circles
const checkCircleCollision = (x1: number, y1: number, x2: number, y2: number, combinedRadius: number) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < combinedRadius;
};

export const useGameStore = create<GameState>((set, get) => ({
  players: new Map(),
  messages: [],
  room: null,
  client: null,
  connecting: false,
  error: null,
  gridSize: 20,

  connect: async (username: string) => {
    try {
      set({ connecting: true, error: null });
      
      const client = new Client(GAME_SERVER);
      const room = await client.joinOrCreate("lobby", { username });
      
      console.log("Connected to room:", room.sessionId);

      // Handle state changes
      room.state.players.onAdd = (player: any, key: string) => {
        console.log("Player added:", key, player);
        const players = new Map(get().players);
        players.set(key, {
          x: player.x || 10,
          y: player.y || 10,
          targetX: player.x || 10,
          targetY: player.y || 10,
          username: player.username || 'Player',
          rotation: 0
        });
        set({ players });

        // Listen for changes on this specific player
        player.onChange = () => {
          const players = new Map(get().players);
          const existingPlayer = players.get(key);
          if (!existingPlayer) return;

          const newX = Number(player.x);
          const newY = Number(player.y);

          if (isNaN(newX) || isNaN(newY)) return;

          players.set(key, {
            ...existingPlayer,
            targetX: newX,
            targetY: newY
          });
          set({ players });
        };
      };

      room.state.players.onRemove = (player: any, key: string) => {
        console.log("Player removed:", key);
        const players = new Map(get().players);
        players.delete(key);
        set({ players });
      };

      // Handle chat messages
      room.state.messages.onAdd = (message: any) => {
        const messages = [...get().messages];
        messages.push({
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp
        });

        // If it's a player message (not system), update their chat bubble
        if (message.sender !== 'System') {
          const players = new Map(get().players);
          const player = Array.from(players.values()).find(p => p.username === message.sender);
          if (player) {
            player.lastChatMessage = message.content;
            player.lastChatTime = message.timestamp;
          }
        }

        set({ messages });
      };

      // Initial state
      const initialPlayers = new Map<string, Player>();
      room.state.players.forEach((player: any, key: string) => {
        initialPlayers.set(key, {
          x: player.x || 10,
          y: player.y || 10,
          targetX: player.x || 10,
          targetY: player.y || 10,
          username: player.username || 'Player',
          rotation: 0
        });
      });

      // Initial messages
      const initialMessages: ChatMessage[] = [];
      room.state.messages.forEach((message: any) => {
        initialMessages.push({
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp
        });
      });

      set({ 
        client,
        room,
        players: initialPlayers,
        messages: initialMessages,
        connecting: false,
        error: null
      });

    } catch (error: any) {
      console.error("Connection error:", error);
      set({ 
        error: error.message || "Failed to connect",
        connecting: false,
        room: null,
        players: new Map(),
        messages: []
      });
    }
  },

  disconnect: () => {
    const { room } = get();
    if (room) {
      room.leave();
    }
    set({
      client: null,
      room: null,
      players: new Map(),
      connecting: false,
      error: null
    });
  },

  movePlayer: (x: number, y: number) => {
    const { room } = get();
    if (!room) return;

    const currentPlayer = get().players.get(room.sessionId);
    if (!currentPlayer) return;

    // Validate coordinates
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
      console.error('Invalid coordinates:', { x, y });
      return;
    }

    // Ensure coordinates are within bounds
    x = Math.max(0, Math.min(get().gridSize, x));
    y = Math.max(0, Math.min(get().gridSize, y));

    // Check collisions with resource nodes
    for (const node of RESOURCE_NODES) {
      if (checkCircleCollision(x, y, node.position.x, node.position.z, PLAYER_RADIUS + RESOURCE_RADIUS)) {
        // Collision detected, prevent movement
        return;
      }
    }

    // Check collisions with other players
    for (const [id, player] of get().players.entries()) {
      if (id !== room.sessionId) { // Don't check collision with self
        if (checkCircleCollision(x, y, player.x, player.y, PLAYER_RADIUS * 2)) {
          // Collision detected, prevent movement
          return;
        }
      }
    }

    // Only update if position has changed significantly
    if (Math.abs(x - currentPlayer.x) < 0.001 && Math.abs(y - currentPlayer.y) < 0.001) {
      return;
    }

    // Calculate movement direction for rotation
    const dx = x - currentPlayer.x;
    const dy = y - currentPlayer.y;
    const rotation = Math.atan2(dx, -dy);

    // Update local state immediately for responsiveness
    const players = new Map(get().players);
    players.set(room.sessionId, {
      ...currentPlayer,
      x: x,
      y: y,
      targetX: x,
      targetY: y,
      rotation: rotation
    });
    set({ players });

    // Send to server
    room.send("move", { x, y });
  },

  sendChat: (content: string) => {
    const { room } = get();
    if (room && content.trim()) {
      room.send("chat", { content: content.trim() });
    }
  },

  updatePositions: () => {
    const players = new Map(get().players);
    let updated = false;

    players.forEach((player, key) => {
      const dx = player.targetX - player.x;
      const dy = player.targetY - player.y;

      // Only update if there's significant movement
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        // Use a higher threshold for snapping to target position
        const snapThreshold = 0.05;
        const newX = Math.abs(dx) < snapThreshold ? player.targetX : player.x + dx * INTERPOLATION_SPEED;
        const newY = Math.abs(dy) < snapThreshold ? player.targetY : player.y + dy * INTERPOLATION_SPEED;

        // Calculate rotation based on movement direction
        const rotation = Math.atan2(dx, -dy);

        players.set(key, {
          ...player,
          x: newX,
          y: newY,
          rotation: rotation
        });
        updated = true;
      }
    });

    if (updated) {
      set({ players });
    }
  }
})); 