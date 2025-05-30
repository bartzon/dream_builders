import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  gainCapital,
  drawCards,
  applyTemporaryBonus,
} from '../utils/effect-helpers';

const passiveEffect = () => {};

// Effects for Community Leader cards
export const communityLeaderCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Town Hall: Draw 1 card for every Employee you control.
  'town_hall': (G, playerID) => {
    drawCards(G, playerID, G.players[playerID].board.Employees.length);
  },
  
  // Mutual Aid: Gain 2 capital.
  'mutual_aid': (G, playerID) => {
    gainCapital(G, playerID, 2);
  },
  
  // Hype Train: Recurring: If you played 2+ cards last turn, gain 1 capital.
  'hype_train': passiveEffect, // Handled in passive effects
  
  // Mentorship Circle: Draw an extra card at the start of your turn.
  'mentorship_circle': passiveEffect, // Handled in passive effects
  
  // Steady Fans: Recurring: Gain 1 capital every other turn.
  'steady_fans': passiveEffect, // Handled in passive effects
  
  // Shared Spotlight: Draw 2 cards. If you've played 2+ cards this turn, reduce the cost of a card in your hand by 1.
  'shared_spotlight': (G, playerID) => {
    drawCards(G, playerID, 2);
    const ctx = G.effectContext?.[playerID];
    if (ctx?.cardsPlayedThisTurn && ctx.cardsPlayedThisTurn >= 2) {
      // Set a temporary bonus for next card
      applyTemporaryBonus(G, playerID, 'nextCardDiscount', 1);
    }
  },
  
  // Community Manager: Your Tools and Actions cost 1 less.
  'community_manager': passiveEffect, // Cost reduction handled in getCardDiscount
  
  // Live AMA: Draw 2 cards. Gain 1 capital.
  'live_ama': (G, playerID) => {
    drawCards(G, playerID, 2);
    gainCapital(G, playerID, 1);
  },
  
  // Merch Drop: Costs 1 less if you played 2+ cards this turn. Choose a Product and add +2 to its inventory.
  'merch_drop': (G, playerID) => {
    // Cost reduction is handled in getCardDiscount
    // For now, add inventory to the first product with inventory
    const product = G.players[playerID].board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 2;
      // TODO: Implement product selection UI when choice system is available
    }
  },
  
  // Grassroots Launch: Add +2 inventory to all Products.
  'grassroots_launch': (G, playerID) => {
    G.players[playerID].board.Products.forEach(product => {
      if (product.inventory !== undefined) {
        product.inventory += 2;
      }
    });
  },
}; 