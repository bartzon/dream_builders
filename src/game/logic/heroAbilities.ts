import type { GameState } from '../state';
import { drawCard } from './utils/deck-helpers';
import { initEffectContext } from './effectContext';

// Hero Ability Effects Registry
export const heroAbilityEffects: Record<string, (G: GameState, playerID: string) => void> = {
  // === HERO POWERS ===
  
  // Solo Hustler Hero Power: Grind
  // Draw 1 card. If it's a Product, reduce its cost by 1 this turn.
  'solo_hustler_grind': (G, playerID) => {
    const player = G.players[playerID];
    
    // Set up effect context if needed
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    
    // Draw a card
    const handSizeBefore = player.hand.length;
    drawCard(player);
    
    // If we drew a card and it's a Product, mark it for discount
    if (player.hand.length > handSizeBefore) {
      const drawnCard = player.hand[player.hand.length - 1];
      if (drawnCard.type === 'Product') {
        // Track this specific card for a 1 cost discount
        if (!G.effectContext[playerID].soloHustlerDiscountedCard) {
          G.effectContext[playerID].soloHustlerDiscountedCard = drawnCard.id;
        }
      }
    }
    
    player.heroAbilityUsed = true;
  },
  
  // Brand Builder Hero Power: Engage
  // Add 2 Inventory to a Product.
  'brand_builder_engage': (G, playerID) => {
    const player = G.players[playerID];
    
    // Set up effect context if needed
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    
    // Find a Product to add inventory to
    // In full implementation, player would choose which Product
    // For now, add to a random Product
    const productsWithInventory = player.board.Products.filter(p => p.inventory !== undefined);
    if (productsWithInventory.length > 0) {
      const randomIndex = Math.floor(Math.random() * productsWithInventory.length);
      const selectedProduct = productsWithInventory[randomIndex];
      if (selectedProduct.inventory !== undefined) {
        selectedProduct.inventory += 2;
        
        // Track affected card for UI highlighting
        if (!G.effectContext[playerID].recentlyAffectedCardIds) {
          G.effectContext[playerID].recentlyAffectedCardIds = [];
        }
        G.effectContext[playerID].recentlyAffectedCardIds.push(selectedProduct.id);
        
        if (G.gameLog) {
          G.gameLog.push(`Engage: Added +2 inventory to ${selectedProduct.name}.`);
        }
      }
    }
    
    player.heroAbilityUsed = true;
  },
  
  // Automation Architect Hero Power: Deploy Script
  // Gain 1 recurring Capital next turn.
  'automation_architect_deploy': (G, playerID) => {
    const player = G.players[playerID];
    
    // Set up effect context if needed
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    
    // Add recurring capital for next turn
    G.effectContext[playerID].recurringCapitalNextTurn = 
      (G.effectContext[playerID].recurringCapitalNextTurn || 0) + 1;
    
    player.heroAbilityUsed = true;
  },
  
  // Community Leader Hero Power: Go Viral
  // If you played 2+ cards this turn, add a copy of a Product in play to your inventory.
  'community_leader_viral': (G, playerID) => {
    const player = G.players[playerID];
    
    // Check if combo threshold was met
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      // Find a Product to copy inventory from
      // In full implementation, player would choose
      const product = player.board.Products.find(p => p.inventory !== undefined);
      if (product && product.inventory !== undefined) {
        product.inventory += 1;
      }
    }
    
    player.heroAbilityUsed = true;
  },
  
  // Serial Founder Hero Power: Double Down
  // Choose one: draw a card OR add 2 inventory to a Product.
  'serial_founder_double_down': (G, playerID) => {
    const player = G.players[playerID];
    // ensureEffectContext(G, playerID); // Not strictly needed if only setting pendingChoice

    player.pendingChoice = {
      type: 'choose_option',
      effect: 'serial_founder_double_down', // The makeChoice will handle sub-effects based on option index
      options: ['Draw a card', 'Add 2 inventory to a Product'],
      // sourceCard is not needed as it's a hero power
    };
    // player.heroAbilityUsed = true; // This is already set by the useHeroAbility move in game.ts
  },
}; 