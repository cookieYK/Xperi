import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema {
  @type("number") x: number = 10.5;  // Start more centered in larger grid
  @type("number") y: number = 10.5;
  @type("string") username: string = "";
}

class ChatMessage extends Schema {
  @type("string") sender: string = "";
  @type("string") content: string = "";
  @type("number") timestamp: number = 0;
}

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([ChatMessage]) messages = new Array<ChatMessage>();
  @type("number") gridSize: number = 20;  // Increased grid size
}

export class GameRoom extends Room<GameState> {
  maxClients = 50;
  maxChatHistory = 50; // Keep last 50 messages

  onCreate() {
    console.log("GameRoom created!");
    this.setState(new GameState());

    this.onMessage("move", (client, data: { x: number; y: number }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      // Ensure x and y are valid numbers
      let newX = Number(data.x);
      let newY = Number(data.y);

      // Check if values are NaN and use current position if they are
      if (isNaN(newX)) newX = player.x;
      if (isNaN(newY)) newY = player.y;

      // Clamp values to grid boundaries (adding 0.5 to center on tiles)
      newX = Math.max(0.5, Math.min(this.state.gridSize - 0.5, newX));
      newY = Math.max(0.5, Math.min(this.state.gridSize - 0.5, newY));
      
      console.log(`Moving player ${client.sessionId} to (${newX}, ${newY})`);
      
      // Only update if position actually changed
      if (newX !== player.x || newY !== player.y) {
        player.x = newX;
        player.y = newY;
      }
    });

    this.onMessage("chat", (client, data: { content: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (player && data.content.trim()) {
        const message = new ChatMessage();
        message.sender = player.username;
        message.content = data.content.trim();
        message.timestamp = Date.now();

        // Add new message and keep only last maxChatHistory messages
        this.state.messages.push(message);
        if (this.state.messages.length > this.maxChatHistory) {
          this.state.messages.splice(0, this.state.messages.length - this.maxChatHistory);
        }

        console.log(`Chat from ${player.username}: ${message.content}`);
      }
    });
  }

  onJoin(client: Client, options: { username: string }) {
    console.log(`Player ${client.sessionId} joining...`);
    
    const player = new Player();
    player.username = options.username;
    
    // Start at center of grid (centered on tile)
    player.x = 10.5;  // Center of 20x20 grid
    player.y = 10.5;
    
    this.state.players.set(client.sessionId, player);
    console.log(`Player ${client.sessionId} joined at position (${player.x}, ${player.y})`);
    console.log("Current players:", this.state.players.size);

    // Broadcast join message
    const joinMessage = new ChatMessage();
    joinMessage.sender = "System";
    joinMessage.content = `${player.username} joined the room`;
    joinMessage.timestamp = Date.now();
    this.state.messages.push(joinMessage);
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      // Broadcast leave message
      const leaveMessage = new ChatMessage();
      leaveMessage.sender = "System";
      leaveMessage.content = `${player.username} left the room`;
      leaveMessage.timestamp = Date.now();
      this.state.messages.push(leaveMessage);
    }

    console.log(`Player ${client.sessionId} left`);
    this.state.players.delete(client.sessionId);
  }
} 