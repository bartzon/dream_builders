import type { GameState } from '../state';

// Effect context to track temporary state modifications
export interface EffectContext {
  // Revenue modifiers
  tempSalesBoost?: number;
  flashSaleActive?: boolean;
  nextProductBonus?: number;
  doubleRevenueThisTurn?: boolean;
  nextActionRevenue?: number;
  
  // Cost modifiers
  nextCardDiscount?: number;
  
  // Play modifiers
  extraCardPlays?: number;
  extraActionPlays?: number;
  
  // Capital modifiers
  doubleCapitalGain?: boolean;
  
  // Turn tracking
  firstProductPlayed?: boolean;
  playedActionThisTurn?: boolean;
  playedToolThisTurn?: boolean;
  playedActionsThisTurn?: number;
  soldProductThisTurn?: boolean;
  soldProductLastTurn?: boolean;
  itemsSoldThisTurn?: number;
}

// Initialize effect context for each player
export function initEffectContext(): EffectContext {
  return {
    tempSalesBoost: 0,
    flashSaleActive: false,
    nextProductBonus: 0,
    doubleRevenueThisTurn: false,
    nextActionRevenue: 0,
    nextCardDiscount: 0,
    extraCardPlays: 0,
    extraActionPlays: 0,
    doubleCapitalGain: false,
    firstProductPlayed: false,
    playedActionThisTurn: false,
    playedToolThisTurn: false,
    playedActionsThisTurn: 0,
    soldProductThisTurn: false,
    soldProductLastTurn: false,
    itemsSoldThisTurn: 0,
  };
}

// Clear temporary effects at end of turn
export function clearTempEffects(G: GameState, playerID: string) {
  if (G.effectContext?.[playerID]) {
    const ctx = G.effectContext[playerID];
    
    // Move current turn data to last turn
    ctx.soldProductLastTurn = ctx.soldProductThisTurn || false;
    
    // Clear temporary effects
    ctx.tempSalesBoost = 0;
    ctx.flashSaleActive = false;
    ctx.nextProductBonus = 0;
    ctx.doubleRevenueThisTurn = false;
    ctx.nextActionRevenue = 0;
    ctx.extraCardPlays = 0;
    ctx.extraActionPlays = 0;
    ctx.doubleCapitalGain = false;
    ctx.firstProductPlayed = false;
    ctx.playedActionThisTurn = false;
    ctx.playedToolThisTurn = false;
    ctx.playedActionsThisTurn = 0;
    ctx.soldProductThisTurn = false;
    ctx.itemsSoldThisTurn = 0;
  }
} 