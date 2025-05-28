import '../index.css';
import React from 'react';
import { Client } from 'boardgame.io/react';
import { DreamBuildersGame } from '../game/game';
import type { GameState } from '../game/state';
import type { BoardProps } from 'boardgame.io/react';
import { PlayerBoard } from './components/PlayerBoard';
import { GameStatus } from './components/GameStatus';
import { formatCurrency } from './utils/format';
import { GAME_CONFIG } from '../game/constants';

// Game board component
function DreamBuildersBoard({ G, ctx, moves, playerID, events }: BoardProps<GameState>) {
  if (!playerID) return <div>Waiting for player...</div>;
  
  const currentPlayer = G.players[playerID];
  const isMyTurn = ctx.currentPlayer === playerID;
  
  const handlePlayCard = (cardIndex: number) => {
    if (isMyTurn) {
      moves.playCard(cardIndex);
    }
  };
  
  const handleSellProduct = (productId: string) => {
    if (isMyTurn) {
      moves.sellProduct(productId);
    }
  };
  
  const handleUseHeroAbility = () => {
    if (isMyTurn && !currentPlayer.heroAbilityUsed) {
      moves.useHeroAbility();
    }
  };
  
  const handleEndTurn = () => {
    if (isMyTurn) {
      events?.endTurn?.();
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Sidebar - Game Status */}
            <div className="lg:col-span-1">
              <GameStatus gameState={G} currentPlayerID={playerID} />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Game Over Status */}
              {G.gameOver && (
                <div className={`p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg ${
                  G.winner ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                } border-2`}>
                  <h2 className="text-base sm:text-lg font-bold">
                    {G.winner 
                      ? `🎉 Victory! The team reached ${formatCurrency(GAME_CONFIG.REVENUE_GOAL)}!` 
                      : '😢 Defeat! The team ran out of options.'}
                  </h2>
                </div>
              )}
              
              {/* Current Player */}
              <PlayerBoard 
                player={currentPlayer}
                isCurrentPlayer={true}
                isMyTurn={isMyTurn}
                onPlayCard={handlePlayCard}
                onSellProduct={handleSellProduct}
                onUseHeroAbility={handleUseHeroAbility}
              />
              
              {/* Other Players */}
              {Object.keys(G.players).length > 1 && (
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-bold mb-2">Other Players</h3>
                  {Object.entries(G.players)
                    .filter(([id]) => id !== playerID)
                    .map(([id, player]) => (
                      <PlayerBoard 
                        key={id}
                        player={player}
                        isCurrentPlayer={false}
                        isMyTurn={false}
                      />
                    ))}
                </div>
              )}
              
              {/* Add padding at bottom to ensure content isn't hidden behind End Turn button */}
              {isMyTurn && !G.gameOver && (
                <div className="h-20" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* End Turn Button - Now in a fixed bottom bar */}
      {isMyTurn && !G.gameOver && (
        <div className="bg-white border-t shadow-lg p-2 sm:p-4">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={handleEndTurn}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md text-sm sm:text-base"
            >
              End Turn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Create the client
const DreamBuildersClient = Client({
  game: DreamBuildersGame,
  board: DreamBuildersBoard,
  numPlayers: 1,
  debug: true,
});

export function App() {
  return <DreamBuildersClient playerID="0" />;
} 