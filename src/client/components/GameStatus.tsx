import React from 'react';
import type { GameState } from '../../game/state';
import { formatCurrency } from '../utils/format';
import { GAME_CONFIG } from '../../game/constants';

interface GameStatusProps {
  gameState: GameState;
  currentPlayerID: string;
}

export function GameStatus({ gameState, currentPlayerID }: GameStatusProps) {
  const progressPercentage = (gameState.teamRevenue / GAME_CONFIG.REVENUE_GOAL) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-bold mb-3">Game Status</h2>
      
      {/* Revenue Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Team Revenue</span>
          <span className="font-semibold">
            {formatCurrency(gameState.teamRevenue)} / {formatCurrency(GAME_CONFIG.REVENUE_GOAL)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {progressPercentage.toFixed(1)}% to victory
        </div>
      </div>
      
      {/* Turn Info */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Turn:</span>
          <span className="ml-2 font-semibold">{gameState.turn}</span>
        </div>
        <div>
          <span className="text-gray-600">Current Player:</span>
          <span className="ml-2 font-semibold">
            {gameState.currentPlayer === currentPlayerID ? 'You' : `Player ${gameState.currentPlayer}`}
          </span>
        </div>
      </div>
      
      {/* Player Summary */}
      <div className="mt-3 pt-3 border-t">
        <h3 className="text-sm font-semibold mb-2">Players</h3>
        <div className="space-y-1">
          {Object.entries(gameState.players).map(([id, player]) => (
            <div key={id} className="flex justify-between text-xs">
              <span className={id === currentPlayerID ? 'font-semibold' : ''}>
                {player.hero} {id === currentPlayerID && '(You)'}
              </span>
              <span className="text-green-600">
                {formatCurrency(player.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Effect Context Debug (optional - remove in production) */}
      {gameState.effectContext?.[currentPlayerID] && (
        <div className="mt-3 pt-3 border-t">
          <h3 className="text-sm font-semibold mb-2">Active Effects</h3>
          <div className="text-xs space-y-1">
            {gameState.effectContext[currentPlayerID].flashSaleActive && (
              <div className="text-green-600">• Flash Sale Active (+$50k per sale)</div>
            )}
            {gameState.effectContext[currentPlayerID].doubleRevenueThisTurn && (
              <div className="text-purple-600">• Revenue Doubled This Turn</div>
            )}
            {(gameState.effectContext[currentPlayerID].nextProductBonus || 0) > 0 && (
              <div className="text-blue-600">
                • Next Product: +${(gameState.effectContext[currentPlayerID].nextProductBonus! / 1000).toFixed(0)}k
              </div>
            )}
            {(gameState.effectContext[currentPlayerID].extraActionPlays || 0) > 0 && (
              <div className="text-orange-600">
                • Extra Actions: {gameState.effectContext[currentPlayerID].extraActionPlays}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 