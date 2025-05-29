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
  recurringCapitalNextTurn?: number;
  
  // Turn tracking
  firstProductPlayed?: boolean;
  playedActionThisTurn?: boolean;
  playedToolThisTurn?: boolean;
  playedActionsThisTurn?: number;
  soldProductThisTurn?: boolean;
  soldProductLastTurn?: boolean;
  itemsSoldThisTurn?: number;
  cardsPlayedThisTurn?: number;
  
  // Appeal system (Brand Builder)
  tempAppealBoosts?: Record<string, number>; // product ID -> appeal bonus
  globalAppealBoost?: number;
  
  // Product mechanics
  productCostReduction?: number;
  canRefreshProduct?: boolean;
  
  // Combo mechanics (Community Leader)
  comboThreshold?: number;
  comboActive?: boolean;
  effectsDoubled?: boolean;
  
  // Automation mechanics (Automation Architect)
  automatedSales?: boolean;
  toolEffectBonus?: number;
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
    recurringCapitalNextTurn: 0,
    firstProductPlayed: false,
    playedActionThisTurn: false,
    playedToolThisTurn: false,
    playedActionsThisTurn: 0,
    soldProductThisTurn: false,
    soldProductLastTurn: false,
    itemsSoldThisTurn: 0,
    cardsPlayedThisTurn: 0,
    tempAppealBoosts: {},
    globalAppealBoost: 0,
    productCostReduction: 0,
    canRefreshProduct: false,
    comboThreshold: 2,
    comboActive: false,
    effectsDoubled: false,
    automatedSales: false,
    toolEffectBonus: 0,
  };
}

// Clear temporary effects at end of turn
export function clearTempEffects(G: GameState, playerID: string) {
  if (G.effectContext?.[playerID]) {
    const ctx = G.effectContext[playerID];
    
    // Move current turn data to last turn
    ctx.soldProductLastTurn = ctx.soldProductThisTurn || false;
    
    // Apply recurring capital if any
    if (ctx.recurringCapitalNextTurn && ctx.recurringCapitalNextTurn > 0) {
      const player = G.players[playerID];
      player.capital = Math.min(10, player.capital + ctx.recurringCapitalNextTurn);
      ctx.recurringCapitalNextTurn = 0;
    }
    
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
    ctx.cardsPlayedThisTurn = 0;
    ctx.tempAppealBoosts = {};
    ctx.globalAppealBoost = 0;
    ctx.productCostReduction = 0;
    ctx.canRefreshProduct = false;
    ctx.comboActive = false;
    ctx.effectsDoubled = false;
    ctx.automatedSales = false;
    ctx.toolEffectBonus = 0;
  }
} 