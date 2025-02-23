import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import { createServer } from "http";
import express from "express";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

const port = Number(process.env.PORT || 3001);
const app = express();

// Enable CORS
app.use(cors());

// Create HTTP Server
const httpServer = createServer(app);

// Create WebSocket server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
    pingInterval: 5000,
    pingMaxRetries: 3,
  })
});

// Define the lobby room
gameServer.define("lobby", GameRoom)
  .enableRealtimeListing();

// Register Colyseus monitor
app.use("/colyseus", monitor());

// Listen on the HTTP server
httpServer.listen(port, () => {
  console.log(`🎮 Game server is running on ws://localhost:${port}`);
}); 