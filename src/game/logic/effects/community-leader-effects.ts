import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  gainCapital,
  drawCards,
} from '../utils/effect-helpers';
import { sellFirstAvailableProduct } from '../utils/sales-helpers';

const passiveEffect = () => {};

// Effects for Community Leader cards
export const communityLeaderCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Town Hall: Draw 1 card for every Employee you control.
  'town_hall': (G, playerID) => {
    drawCards(G, playerID, G.players[playerID].board.Employees.length);
  },
  // Mutual Aid: Each player gains 1 capital.
  'mutual_aid': (G) => {
    Object.keys(G.players).forEach(id => gainCapital(G, id, 1));
  },
  // Hype Train: Your team gets +1 capital whenever you gain Audience.
  'hype_train': passiveEffect, // Audience part not implemented
  // Mentorship Circle: Your teammates may draw 1 extra card at the start of their turn.
  'mentorship_circle': passiveEffect, // Team/multiplayer not fully supported
  // Fanbase: Recurring: Gain 1 Audience.
  'fanbase': passiveEffect, // Audience part not implemented
  // Shared Spotlight: Choose a teammate. They draw 2 cards.
  'shared_spotlight': (G, playerID) => drawCards(G, playerID, 2), // Simplified for single player
  // Community Manager: Your Tools and Actions cost 1 less.
  'community_manager': passiveEffect, // Cost reduction handled in getCardDiscount if implemented
  // Live AMA: Draw 2 cards. Add 2 Audience.
  'live_ama': (G, playerID) => { // Audience part not implemented
    drawCards(G, playerID, 2);
  },
  // Merch Drop: Costs 1 less if you have 5+ Audience. Sells for 3.
  'merch_drop': passiveEffect, // Audience part not implemented, cost reduction in getCardDiscount
  // Grassroots Launch: Add 5 Audience. You may sell a Product.
  'grassroots_launch': (G, playerID) => { // Audience part not implemented
    sellFirstAvailableProduct(G, playerID); 
  },
}; 