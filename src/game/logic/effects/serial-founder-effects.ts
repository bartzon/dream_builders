import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  ensureEffectContext,
  gainCapital,
  drawCards,
} from '../utils/effect-helpers';
import {
  sellProduct,
  sellFirstAvailableProduct,
} from '../utils/sales-helpers';

const passiveEffect = () => {};

// Effects for Serial Founder cards
export const serialFounderCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Legacy Playbook: Draw 1 extra card at the start of your turn.
  'legacy_playbook': passiveEffect, // Handled in processPassiveEffects if implemented
  // Advisory Board: Whenever you play a Product, draw 1 card.
  'advisory_board': (G, playerID) => {
    const player = G.players[playerID];
    let cardsToDraw = 0;
    if (player.board.Tools.length > 0) cardsToDraw++;
    if (player.board.Products.length > 0) cardsToDraw++;
    if (player.board.Employees.length > 0) cardsToDraw++;
    drawCards(G, playerID, cardsToDraw);
  },
  // Spin-Off: Costs 1 less for each Product you control. Sells for 4.
  'spin_off': passiveEffect, // Cost reduction handled in getCardDiscount if implemented
  // High-Profile Exit: Sell all your Products. Gain 2 extra capital per Product.
  'high_profile_exit': (G, playerID) => {
    const player = G.players[playerID];
    let productCount = 0;
    player.board.Products.forEach((product: Card) => {
      if (product.inventory && product.inventory > 0) {
        sellProduct(G, playerID, product, product.inventory); 
        productCount++;
      }
    });
    gainCapital(G, playerID, productCount * 2);
  },
  // Tech Press Feature: Add 3 Audience. If you control a Product, add 5 instead.
  'tech_press_feature': (G, playerID) => { // Audience part not implemented
    drawCards(G, playerID, G.players[playerID].board.Products.length > 0 ? 2 : 1); // Placeholder
  },
  // Serial Operator: Your Products cost 1 less.
  'serial_operator': passiveEffect, // Cost reduction handled in getCardDiscount if implemented
  // Investor Buzz: Next time you gain capital this turn, double it.
  'investor_buzz': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.doubleCapitalGain = true;
  },
  // Incubator Resources: At the start of your turn, gain 1 capital or draw 1.
  'incubator_resources': passiveEffect, // Choice handled in processPassiveEffects if implemented
  // Board of Directors: Recurring: Gain 2 capital.
  'board_of_directors': passiveEffect, // Handled in processPassiveEffects if implemented
  // Black Friday Blitz: Sell a Product. If it's your third Product this turn, gain 3 extra capital.
  'black_friday_blitz': (G, playerID) => sellFirstAvailableProduct(G, playerID), // Conditional capital not implemented
}; 