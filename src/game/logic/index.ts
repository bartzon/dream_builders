// Re-export all logic functions
export { cardEffects, resolveFastPivotEffect } from './cardEffects';
export { heroAbilityEffects } from './heroAbilities';
export { 
  initEffectContext, 
  clearTempEffects,
  type EffectContext 
} from './effectContext';
export { 
  processPassiveEffects, 
  processOverheadCosts,
  processAutomaticSales,
  getCardDiscount,
  getCardCostInfo,
  handleCardPlayEffects
} from './turnEffects';

// Export from new utils sub-modules
export { drawCard } from './utils/deck-helpers';
export { spendCapital } from './utils/player-resource-helpers';
export { initializePlayer } from './utils/player-helpers';
export { checkGameEnd } from './utils/game-state-helpers';
export * from './utils/effect-helpers';
export * from './utils/inventory-helpers';
export * from './utils/choice-helpers';
export * from './utils/sales-helpers'; // This also exports sellProduct and sellFirstAvailableProduct 

// Export choice helpers
export { 
  createProductChoice,
  addPendingChoice,
  getCurrentPendingChoice,
  resolveCurrentPendingChoice,
  hasPendingChoice,
  clearPendingChoices
} from './utils/choice-helpers'; 