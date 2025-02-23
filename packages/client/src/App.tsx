import React from 'react';
import { Game } from './components/Game';
import { Menu } from './components/Menu';
import { useGameStore } from './store/gameStore';

export function App() {
  const { room } = useGameStore();

  return room ? <Game /> : <Menu />;
}

export default App; 