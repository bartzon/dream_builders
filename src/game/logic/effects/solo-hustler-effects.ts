import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  ensureEffectContext,
  gainCapital,
  drawCards,
  applyTemporaryBonus
} from '../utils/effect-helpers';
// cardEffects will be imported dynamically or passed if needed by Quick Learner.
// For now, assuming it will be available in the scope where these effects are called.

const passiveEffect = () => {}; // Define passiveEffect if it's used here

// Effects for Solo Hustler cards
export const soloHustlerCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Hustle Hard: Draw 2 cards, gain 1 capital.
  'hustle_hard': (G, playerID) => {
    drawCards(G, playerID, 2);
    gainCapital(G, playerID, 1);
  },
  // Bootstrap Capital: Gain 2 capital.
  'bootstrap_capital': (G, playerID) => {
    gainCapital(G, playerID, 2);
  },
  // DIY Assembly: Recurring: Reduce Product costs by 1.
  'diy_assembly': passiveEffect,
  // Fast Pivot: Destroy a Product you control. Draw 2 cards. Your next Product this turn costs 2 less.
  'fast_pivot': (G, playerID) => {
    const player = G.players[playerID];
    if (player.board.Products.length > 0) {
      const ctx = ensureEffectContext(G, playerID);
      ctx.fastPivotProductDestroyPending = true;
    }
  },
  // Freelancer Network: When played, draw 2 cards.
  'freelancer_network': (G, playerID) => {
    drawCards(G, playerID, 2);
  },
  // Resourceful Solutions: Next card costs 2 less.
  'resourceful_solutions': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 2);
  },
  // Scrappy Marketing: If you have a Product in play, draw 2 cards.
  'scrappy_marketing': (G, playerID) => {
    const player = G.players[playerID];
    if (player.board.Products.length > 0) {
      drawCards(G, playerID, 2);
    }
  },
  // Midnight Oil: Draw 3 cards, then discard 1 card.
  'midnight_oil': (G, playerID) => {
    drawCards(G, playerID, 3);
    const ctx = ensureEffectContext(G, playerID);
    ctx.midnightOilDiscardPending = true;
  },
  // Quick Learner: Can only be played after an Action. Copy the effect of the last Action played this turn.
  'quick_learner': passiveEffect,
  // Shoestring Budget: Recurring: The first card you play each turn costs 1 less.
  'shoestring_budget': passiveEffect,
}; 