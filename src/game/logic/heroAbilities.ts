import type { GameState } from '../state';
import { drawCard } from './utils/deck-helpers';
import { initEffectContext } from './effectContext';
import { addPendingChoice } from './utils/choice-helpers';
import { sharedProductPool } from '../data/shared-products';

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
    drawCard(player, 'Solo Hustler (Grind)', G.gameLog);
    
    // If we drew a card and it's a Product, mark it for discount
    if (player.hand.length > handSizeBefore) {
      const drawnCard = player.hand[player.hand.length - 1];
      if (drawnCard.type === 'Product') {
        // Track this specific card for a 1 cost discount
        if (!G.effectContext[playerID].soloHustlerDiscountedCard) {
          G.effectContext[playerID].soloHustlerDiscountedCard = drawnCard.id;
        }
        // Log the discount
        if (G.gameLog) {
          G.gameLog.push(`Solo Hustler (Grind): ${drawnCard.name} costs 1 less this turn`);
        }
      }
    }
    
    player.heroAbilityUsed = true;
  },
  
  // Brand Builder Hero Power: Engage
  // Add 2 Inventory to a Product.
  'brand_builder_engage': (G, playerID) => {
    const player = G.players[playerID];
    
    // Find all Products on the board
    const products = player.board.Products.filter(p => p.isActive !== false && p.inventory !== undefined);
    
    if (products.length > 0) {
      // Create a choice for the player to select which Product
      addPendingChoice(player, {
        type: 'choose_card',
        effect: 'brand_builder_engage_add_inventory',
        cards: products.map(p => ({ ...p })), // Send copies to client
      });
    } else {
      // No products to add inventory to
      if (G.gameLog) {
        G.gameLog.push('Engage: No products available to add inventory to.');
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
      // Find all Products on the board
      const products = player.board.Products.filter(p => p.isActive !== false);
      
      if (products.length > 0) {
        // Select a random Product to copy
        const randomIndex = Math.floor(Math.random() * products.length);
        const productToCopy = products[randomIndex];
        // Find the default inventory for this product from sharedProductPool
        const defaultProduct = sharedProductPool.find(p => p.id === productToCopy.id);
        const productCopy = { ...productToCopy };
        if (defaultProduct && typeof defaultProduct.inventory === 'number') {
          productCopy.inventory = defaultProduct.inventory;
        }
        player.deck.push(productCopy);
        
        if (G.gameLog) {
          G.gameLog.push(`Go Viral: Added a copy of ${productToCopy.name} to your deck!`);
        }
      } else {
        if (G.gameLog) {
          G.gameLog.push('Go Viral: No products on board to copy.');
        }
      }
    } else {
      if (G.gameLog) {
        G.gameLog.push(`Go Viral: Need to play 2+ cards this turn (played ${cardsPlayed}).`);
      }
    }
    
    player.heroAbilityUsed = true;
  },
  
  // Serial Founder Hero Power: Double Down
  // Choose one: draw a card OR add 2 inventory to a Product.
  'serial_founder_double_down': (G, playerID) => {
    const player = G.players[playerID];
    // ensureEffectContext(G, playerID); // Not strictly needed if only setting pendingChoice

    addPendingChoice(player, {
      type: 'choose_option',
      effect: 'serial_founder_double_down', // The makeChoice will handle sub-effects based on option index
      options: ['Draw a card', 'Add 2 inventory to a Product'],
      // sourceCard is not needed as it's a hero power
    });
    // player.heroAbilityUsed = true; // This is already set by the useHeroAbility move in game.ts
  },
}; 