import type { GameState } from '../state';
import type { Card } from '../types';

// Effect context to track temporary state modifications
export interface EffectContext {
  // Revenue modifiers
  tempSalesBoost?: number;
  flashSaleActive?: boolean;
  nextProductBonus?: number;
  doubleRevenueThisTurn?: boolean;
  nextActionRevenue?: number;
  nextProductDiscount?: number;
  productRevenueBoosts?: Record<string, number>; // product ID -> revenue bonus
  
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
  playedActionLastTurn?: boolean;
  playedToolThisTurn?: boolean;
  playedActionsThisTurn?: number;
  soldProductThisTurn?: boolean;
  soldProductLastTurn?: boolean;
  itemsSoldThisTurn?: number;
  cardsPlayedThisTurn?: number;
  cardsPlayedLastTurn?: number;
  productCardsPlayedThisTurn?: number; // Tracks number of Product-type cards played
  
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
  
  // Card effect delays
  midnightOilDiscardPending?: boolean;
  fastPivotProductDestroyPending?: boolean;
  
  // Action tracking (for Quick Learner)
  lastActionEffect?: string;
  lastActionCard?: Card; // Store the actual card for context
  
  // Inventory Support tracking
  delayedInventoryBoostTurns?: number;
  
  // Cost reductions
  soloHustlerDiscountedCard?: string; // Track specific card ID for Solo Hustler discount
  
  // Multi-selection tracking (specific to Warehouse Expansion, might be generalized later)
  warehouseExpansionCount?: number;
  
  // Unified list for recently affected board cards for UI feedback
  recentlyAffectedCardIds?: string[];
}

// Initialize effect context for each player
export function initEffectContext(): EffectContext {
  return {
    tempSalesBoost: 0,
    flashSaleActive: false,
    nextProductBonus: 0,
    doubleRevenueThisTurn: false,
    nextActionRevenue: 0,
    nextProductDiscount: 0,
    nextCardDiscount: 0,
    extraCardPlays: 0,
    extraActionPlays: 0,
    doubleCapitalGain: false,
    recurringCapitalNextTurn: 0,
    firstProductPlayed: false,
    playedActionThisTurn: false,
    playedActionLastTurn: false,
    playedToolThisTurn: false,
    playedActionsThisTurn: 0,
    soldProductThisTurn: false,
    soldProductLastTurn: false,
    itemsSoldThisTurn: 0,
    cardsPlayedThisTurn: 0,
    cardsPlayedLastTurn: 0,
    productCardsPlayedThisTurn: 0,
    tempAppealBoosts: {},
    globalAppealBoost: 0,
    productCostReduction: 0,
    canRefreshProduct: false,
    comboThreshold: 2,
    comboActive: false,
    effectsDoubled: false,
    automatedSales: false,
    toolEffectBonus: 0,
    midnightOilDiscardPending: false,
    fastPivotProductDestroyPending: false,
    lastActionEffect: undefined,
    lastActionCard: undefined,
    delayedInventoryBoostTurns: 0,
    soloHustlerDiscountedCard: undefined,
    warehouseExpansionCount: 0,
    recentlyAffectedCardIds: [],
    productRevenueBoosts: {},
  };
}

// Ensure effect context exists and return it
export function ensureEffectContext(G: GameState, playerID: string): EffectContext {
  if (!G.effectContext) {
    G.effectContext = {};
  }
  if (!G.effectContext[playerID]) {
    G.effectContext[playerID] = initEffectContext();
  }
  return G.effectContext[playerID];
}

// Clear temporary effects at end of turn
export function clearTempEffects(G: GameState, playerID: string) {
  if (G.effectContext?.[playerID]) {
    const ctx = G.effectContext[playerID];
    
    // Move current turn data to last turn
    ctx.soldProductLastTurn = ctx.soldProductThisTurn || false;
    ctx.playedActionLastTurn = ctx.playedActionThisTurn || false;
    ctx.cardsPlayedLastTurn = ctx.cardsPlayedThisTurn || 0;
    
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
    ctx.nextProductDiscount = 0;
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
    ctx.productCardsPlayedThisTurn = 0;
    ctx.tempAppealBoosts = {};
    ctx.globalAppealBoost = 0;
    ctx.productCostReduction = 0;
    ctx.canRefreshProduct = false;
    ctx.comboActive = false;
    ctx.effectsDoubled = false;
    ctx.automatedSales = false;
    ctx.toolEffectBonus = 0;
    ctx.midnightOilDiscardPending = false;
    ctx.fastPivotProductDestroyPending = false;
    ctx.lastActionEffect = undefined;
    ctx.lastActionCard = undefined;
    ctx.soloHustlerDiscountedCard = undefined;
    ctx.warehouseExpansionCount = 0;
    ctx.recentlyAffectedCardIds = [];
    ctx.productRevenueBoosts = {}; // Clear product revenue boosts at end of turn
  }
} 