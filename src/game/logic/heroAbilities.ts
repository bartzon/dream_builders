import type { GameState } from '../state';
import { drawCard } from './utils';
import { initEffectContext } from './effectContext';

// Hero Ability Effects Registry
export const heroAbilityEffects: Record<string, (G: GameState, playerID: string) => void> = {
  // === NEW HERO POWERS ===
  
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
    
    // If we drew a card and it's a Product, reduce its cost
    if (player.hand.length > handSizeBefore) {
      const drawnCard = player.hand[player.hand.length - 1];
      if (drawnCard.type === 'Product') {
        G.effectContext[playerID].productCostReduction = 1;
      }
    }
    
    player.heroAbilityUsed = true;
  },
  
  // Brand Builder Hero Power: Engage
  // Give a Product +1 Appeal this turn.
  'brand_builder_engage': (G, playerID) => {
    const player = G.players[playerID];
    
    // Set up effect context if needed
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    
    // For now, give all Products +1 Appeal this turn
    // In a full implementation, player would choose which Product
    G.effectContext[playerID].globalAppealBoost = 1;
    
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
  // Choose one: draw a card OR refresh 1 used Product.
  'serial_founder_double_down': (G, playerID) => {
    const player = G.players[playerID];
    
    // For now, choose automatically based on situation
    // In full implementation, player would choose
    const hasExhaustedProduct = player.board.Products.some(p => 
      p.inventory !== undefined && p.inventory === 0
    );
    
    if (hasExhaustedProduct) {
      // Refresh a product
      const exhaustedProduct = player.board.Products.find(p => 
        p.inventory !== undefined && p.inventory === 0
      );
      if (exhaustedProduct && exhaustedProduct.inventory !== undefined) {
        exhaustedProduct.inventory = 3; // Refresh with 3 inventory
      }
    } else {
      // Draw a card
      drawCard(player);
    }
    
    player.heroAbilityUsed = true;
  },
  
  // === LEGACY HERO POWERS ===
  
  // Marketer Hero Power: Launch Campaign
  // Gain 2 capital and draw a card. All Products generate +$10,000 this turn.
  'marketer_hero_power': (G, playerID) => {
    const player = G.players[playerID];
    
    // Gain 2 capital
    player.capital = Math.min(10, player.capital + 2);
    
    // Draw a card
    drawCard(player);
    
    // Boost all products by $10k
    const totalProducts = player.board.Products.length;
    player.revenue += 10000 * totalProducts;
    
    player.heroAbilityUsed = true;
  },
  
  // Developer Hero Power: Deploy Code
  // The next card you play this turn costs 2 less. Draw a card.
  'developer_hero_power': (G, playerID) => {
    const player = G.players[playerID];
    
    // Set up effect context if needed
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    
    // Next card costs 2 less
    G.effectContext[playerID].nextCardDiscount = 2;
    
    // Draw a card
    drawCard(player);
    
    player.heroAbilityUsed = true;
  },
  
  // Operator Hero Power: Optimize Operations
  // Gain 1 capital. All your cards generate +$20,000 this turn.
  'operator_hero_power': (G, playerID) => {
    const player = G.players[playerID];
    
    // Gain 1 capital
    player.capital = Math.min(10, player.capital + 1);
    
    // Count all cards on the player's board
    const totalCards = player.board.Tools.length + 
                      player.board.Products.length + 
                      player.board.Employees.length;
    
    // All cards generate +$20,000 this turn
    player.revenue += 20000 * totalCards;
    
    player.heroAbilityUsed = true;
  },
  
  // Visionary Hero Power: Think Big
  // Draw 3 cards, then discard 1. Gain $50,000.
  'visionary_hero_power': (G, playerID) => {
    const player = G.players[playerID];
    
    // Draw 3 cards
    for (let i = 0; i < 3; i++) {
      drawCard(player);
    }
    
    // Discard 1 card (for now, discard the last card)
    // In a full implementation, the player would choose
    if (player.hand.length > 0) {
      player.hand.pop();
    }
    
    // Gain $50,000
    player.revenue += 50000;
    
    player.heroAbilityUsed = true;
  },
  
  // Legacy hero power effects (for backwards compatibility)
  'gain_capital_and_draw': (G, playerID) => {
    heroAbilityEffects['marketer_hero_power'](G, playerID);
  },
  
  'discount_next_card': (G, playerID) => {
    heroAbilityEffects['developer_hero_power'](G, playerID);
  },
  
  'gain_and_sales': (G, playerID) => {
    heroAbilityEffects['operator_hero_power'](G, playerID);
  },
  
  'draw_two_lose_one': (G, playerID) => {
    heroAbilityEffects['visionary_hero_power'](G, playerID);
  },
}; 