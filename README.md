# HabX - Isometric Multiplayer Chat Room

A real-time multiplayer isometric chat room built with React, Three.js, and Colyseus.

## Current Features

### Core Functionality
- Real-time multiplayer synchronization
- Smooth player movement with interpolation
- Isometric grid-based world
- Centered tile positioning system

### Player System
- Dynamic player joining/leaving
- Unique usernames
- Player position synchronization
- Smooth movement interpolation
- Visual distinction between current player and others

### Chat System
- Real-time chat messaging
- Chat bubbles above players (5-second display)
- Persistent chat log with history
- System messages for player joins/leaves
- Message timestamps
- Chat history preservation (last 50 messages)

### Skilling System
- Woodcutting and Mining skills
- Experience-based progression (levels 1-99)
- Resource nodes (trees, rocks, gold rocks)
- Resource depletion and respawn mechanics
- Skill-based success chance
- Visual feedback (XP popups, level-up notifications)
- Skills panel with progress tracking
- Interactive gathering with progress bars

### Visual Features
- 3D isometric rendering
- Smooth camera controls
- Player highlighting
- Grid-based movement
- Custom UI styling with pixel art theme
- Semi-transparent overlays
- Custom scrollbars
- Fade animations for UI elements

### Controls
- WASD/Arrow keys for movement
- Camera rotation with left-click drag
- Camera pan with right-click drag
- Mouse wheel zoom
- Enter to chat

## Technical Stack

### Frontend
- React
- Three.js (@react-three/fiber)
- @react-three/drei
- Zustand (state management)
- TypeScript
- Vite

### Backend
- Colyseus (game server)
- Node.js
- TypeScript
- Express

## Project Structure

```
packages/
├── client/             # Frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── store/      # Game state management
│   │   └── config/     # Game configuration
│   └── package.json
│
└── server/             # Game server
    ├── src/
    │   ├── rooms/      # Colyseus room definitions
    │   └── state/      # Game state schemas
    └── package.json
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development servers:

For the game server:
```bash
cd packages/server
npm run dev
```

For the client:
```bash
cd packages/client
npm run dev
```

3. Open `http://localhost:5173` in your browser

## Development Log

### Version 0.1
- Initial implementation of multiplayer connectivity
- Basic player movement
- Grid-based world

### Version 0.2
- Added real-time chat system
- Implemented chat bubbles
- Added system messages
- Improved player movement interpolation

### Version 0.3
- Implemented skilling system with Woodcutting and Mining
- Added resource nodes (trees and rocks)
- Added experience gain and leveling system (1-99 levels)
- Implemented resource depletion and respawn mechanics
- Added gold rocks for higher XP gains
- Added XP popups and level-up notifications
- Added skills panel with progress tracking
- Improved collision detection for resource nodes
- Added gathering animations and progress bars
- Implemented success chance based on skill level

## Planned Features
- Larger world size
- Multiple room types
- Furniture and interactive objects
- Player customization
- Emotes and animations
- Friend system
- Private messaging

## Technical Notes

### State Management
- Uses Zustand for client-side state management
- Colyseus Schema for server-side state
- Real-time synchronization with delta updates

### Movement System
- Grid-based movement with smooth interpolation
- Server-side position validation
- Client-side prediction

### Chat System
- Message queuing and history
- Automatic cleanup of old messages
- Visual feedback for new messages

## Contributing

This is a local development project. Future plans include moving to Git for version control and collaboration.

## License

Currently private. All rights reserved.
