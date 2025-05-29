import '../index.css';
import { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { DreamBuildersGame } from '../game/game';
import type { GameState } from '../game/state';
import type { BoardProps } from 'boardgame.io/react';
import GameScreen from './components/ui/game/game-screen';
import HeroSelection from './components/ui/game/hero-selection';

// Game board component
function DreamBuildersBoard({ G, ctx, moves, playerID, events }: BoardProps<GameState>) {
  if (!playerID) return <div>Waiting for player...</div>;
  
  const isMyTurn = ctx.currentPlayer === playerID;

  return (
    <GameScreen
      gameState={G}
      moves={moves}
      playerID={playerID}
      isMyTurn={isMyTurn}
      events={events}
    />
  );
}

// Create the client outside the component
const DreamBuildersClient = Client({
  game: DreamBuildersGame,
  board: DreamBuildersBoard,
  numPlayers: 1,
  debug: false,
});

export function App() {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);

  // Show hero selection if no hero is selected
  if (!selectedHero) {
    return (
      <HeroSelection onHeroSelected={setSelectedHero} />
    );
  }

  // Show game with selected hero
  return <DreamBuildersClient playerID="0" />;
} 