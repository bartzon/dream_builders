import type { GameState } from '../state';
import type { Card } from '../types';

// Import general helpers used by resolveFastPivotEffect
import {
  drawCards,
  applyTemporaryBonus
} from './utils/effect-helpers';

// Import specific card effect groups
import { soloHustlerCardEffects } from './effects/solo-hustler-effects';
import { brandBuilderCardEffects } from './effects/brand-builder-effects';
import { automationArchitectCardEffects } from './effects/automation-architect-effects';
import { communityLeaderCardEffects } from './effects/community-leader-effects';
import { serialFounderCardEffects } from './effects/serial-founder-effects';
import { productSaleCardEffects } from './effects/product-sale-effects';
import { inventorySupportCardEffects } from './effects/inventory-support-effects';

// Import the setter for sales-helpers to break circular dependency
import { _setSalesHelperCardEffectsRegistry } from './utils/sales-helpers';

// No-op function for passive effects still used as placeholders in some effect groups
// (e.g., if an effect is handled purely by getCardDiscount or processPassiveEffects)
const passiveEffect = () => {}; 

// CARD EFFECTS REGISTRY
// This is now an aggregation of imported effect groups.
export const cardEffects: Record<string, (G: GameState, playerID: string, card: Card) => void> = {
  ...soloHustlerCardEffects,
  ...brandBuilderCardEffects,
  ...automationArchitectCardEffects,
  ...communityLeaderCardEffects,
  ...serialFounderCardEffects,
  ...productSaleCardEffects,
  ...inventorySupportCardEffects,

  // HERO POWER PLACEHOLDERS 
  // These are linked from hero definitions but their logic resides in heroAbilities.ts.
  // They are included here so cardEffects registry is comprehensive, though they won't be called from here.
  'solo_hustler_grind': passiveEffect,
  'brand_builder_engage': passiveEffect,
  'automation_architect_deploy': passiveEffect,
  'community_leader_viral': passiveEffect,
  'serial_founder_double_down': passiveEffect,
};

// Inject the cardEffects registry into the sales helpers module.
// This is crucial for breaking a circular dependency where sellProduct (in sales-helpers)
// needs to be able to call product-specific sale effects from this registry.
_setSalesHelperCardEffectsRegistry(cardEffects);

// SPECIAL EFFECT HANDLERS
// (resolveFastPivotEffect is kept here as it's a specific resolution for a card's pending choice)
export function resolveFastPivotEffect(G: GameState, playerID: string, productToDestroyId: string) {
  const player = G.players[playerID];
  const productIndexInBoard = player.board.Products.findIndex(p => p.id === productToDestroyId);

  if (productIndexInBoard !== -1) {
    player.board.Products.splice(productIndexInBoard, 1); // Destroy product
    drawCards(G, playerID, 2); // Uses imported helper from effect-helpers
    applyTemporaryBonus(G, playerID, 'nextProductDiscount', 2); // Uses imported helper from effect-helpers
  } else {
    console.warn(`Fast Pivot: Product with ID ${productToDestroyId} not found on board for player ${playerID}.`);
  }
} 