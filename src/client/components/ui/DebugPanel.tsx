/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

interface DebugPanelProps {
  gameState: any;
  playerID: string;
}

export function DebugPanel({ gameState, playerID }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!gameState) return null;

  const player = gameState.players?.[playerID];
  const effectContext = gameState.effectContext?.[playerID];

  const debugData = {
    // === BASIC GAME STATE ===
    turn: gameState.turn,
    currentPlayer: gameState.currentPlayer,
    gameOver: gameState.gameOver,
    winner: gameState.winner,

    // === PLAYER STATE ===
    player: {
      hero: player?.hero,
      capital: player?.capital,
      revenue: player?.revenue,
      heroAbilityUsed: player?.heroAbilityUsed,
      handSize: player?.hand?.length,
      deckSize: player?.deck?.length,
      pendingChoice: player?.pendingChoice,
    },

    // === BOARD STATE ===
    board: {
      Products: player?.board?.Products?.map((card: any) => ({
        name: card.name,
        effect: card.effect,
        cost: card.cost,
        inventory: card.inventory,
        revenuePerSale: card.revenuePerSale,
        isActive: card.isActive,
        appeal: card.appeal,
        overheadCost: card.overheadCost,
      })) || [],
      
      Tools: player?.board?.Tools?.map((card: any) => ({
        name: card.name,
        effect: card.effect,
        cost: card.cost,
        isActive: card.isActive,
      })) || [],
      
      Employees: player?.board?.Employees?.map((card: any) => ({
        name: card.name,
        effect: card.effect,
        cost: card.cost,
        isActive: card.isActive,
      })) || [],
    },

    // === HAND STATE ===
    hand: player?.hand?.map((card: any) => ({
      name: card.name,
      type: card.type,
      effect: card.effect,
      cost: card.cost,
      inventory: card.inventory,
      revenuePerSale: card.revenuePerSale,
    })) || [],

    // === EFFECT CONTEXT (Most Important for Debugging) ===
    effectContext: effectContext ? {
      // Turn tracking
      cardsPlayedThisTurn: effectContext.cardsPlayedThisTurn,
      playedActionsThisTurn: effectContext.playedActionsThisTurn,
      playedActionThisTurn: effectContext.playedActionThisTurn,
      playedToolThisTurn: effectContext.playedToolThisTurn,
      firstProductPlayed: effectContext.firstProductPlayed,
      
      // Sales tracking
      soldProductThisTurn: effectContext.soldProductThisTurn,
      soldProductLastTurn: effectContext.soldProductLastTurn,
      itemsSoldThisTurn: effectContext.itemsSoldThisTurn,
      
      // Cost reductions
      nextCardDiscount: effectContext.nextCardDiscount,
      firstCardDiscountUsed: effectContext.firstCardDiscountUsed,
      productCostReduction: effectContext.productCostReduction,
      
      // Revenue bonuses
      nextProductBonus: effectContext.nextProductBonus,
      nextActionRevenue: effectContext.nextActionRevenue,
      flashSaleActive: effectContext.flashSaleActive,
      doubleRevenueThisTurn: effectContext.doubleRevenueThisTurn,
      
      // Extra plays
      extraActionPlays: effectContext.extraActionPlays,
      extraCardPlays: effectContext.extraCardPlays,
      
      // Special effects
      globalAppealBoost: effectContext.globalAppealBoost,
      toolEffectBonus: effectContext.toolEffectBonus,
      effectsDoubled: effectContext.effectsDoubled,
      doubleCapitalGain: effectContext.doubleCapitalGain,
      
      // Pending effects
      midnightOilDiscardPending: effectContext.midnightOilDiscardPending,
      recurringCapitalNextTurn: effectContext.recurringCapitalNextTurn,
      delayedInventoryBoostTurns: effectContext.delayedInventoryBoostTurns,
      fastPivotProductDestroyPending: effectContext.fastPivotProductDestroyPending,
      
      // Product-specific boosts
      productRevenueBoosts: effectContext.productRevenueBoosts,
      
      // Solo Hustler tracking
      soloHustlerDiscountedCard: effectContext.soloHustlerDiscountedCard,
      
      // Quick Learner tracking
      lastActionEffect: effectContext.lastActionEffect,
      lastActionCard: effectContext.lastActionCard ? {
        name: effectContext.lastActionCard.name,
        type: effectContext.lastActionCard.type,
        effect: effectContext.lastActionCard.effect,
      } : null,
    } : null,

    // === CALCULATED VALUES (for debugging) ===
    calculated: {
      timestamp: new Date().toISOString(),
      activeProductCount: player?.board?.Products?.filter((p: any) => p.isActive !== false).length || 0,
      totalInventory: player?.board?.Products?.reduce((sum: number, p: any) => sum + (p.inventory || 0), 0) || 0,
      totalAppeal: player?.board?.Products?.reduce((sum: number, p: any) => sum + (p.appeal || 0), 0) || 0,
    }
  };

  const debugString = JSON.stringify(debugData, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(debugString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy debug data:', err);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold z-50 hover:bg-red-700"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-black bg-opacity-10 z-50 overflow-hidden">
      <div className="bg-white text-black h-full flex flex-col border-2 border-gray-300 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-300 bg-gray-100">
          <h2 className="text-lg font-bold text-gray-800">🐛 Debug</h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className={`px-2 py-1 rounded text-xs font-bold ${
                copySuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copySuccess ? '✅' : '📋'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 bg-white">
          <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-800">
            {debugString}
          </pre>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-2 text-xs text-gray-600 bg-gray-50">
          Copy this data for debugging
        </div>
      </div>
    </div>
  );
} 