import type { GameState } from '../state';
import { drawCard } from '../logic';
import { initEffectContext } from './effectContext';

// Hero Ability Effects Registry
export const heroAbilityEffects: Record<string, (G: GameState, playerID: string) => void> = {
  // Marketer Hero Power: Launch Campaign
  // Gain 2 capital and draw a card. All Products generate +$10,000 this turn.
  'marketer_hero_power': (G, playerID) => {
    const player = G.players[playerID];
    
    // Gain 2 capital
    player.capital = Math.min(10, player.capital + 2);
    
    // Draw a card
    drawCard(player);
    
    // All Products generate +$10,000 this turn
    const totalProducts = Object.values(G.players).reduce((sum, p) => 
      sum + p.board.Products.length, 0
    );
    G.teamRevenue += 10000 * totalProducts;
    
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
    G.teamRevenue += 20000 * totalCards;
    
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
    G.teamRevenue += 50000;
    
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