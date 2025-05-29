import '../index.css';
import { Client } from 'boardgame.io/react';
import { DreamBuildersGame } from '../game/game';
import type { GameState } from '../game/state';
import type { BoardProps } from 'boardgame.io/react';
import GameScreen from './components/ui/game/game-screen';

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

// Create the client
const DreamBuildersClient = Client({
  game: DreamBuildersGame,
  board: DreamBuildersBoard,
  numPlayers: 1,
  debug: false,
});

export function App() {
  return <DreamBuildersClient playerID="0" />;
} 