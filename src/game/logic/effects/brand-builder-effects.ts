import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  gainCapital,
  drawCards,
  applyTemporaryBonus
} from '../utils/effect-helpers';

const passiveEffect = () => {}; // Define passiveEffect if it's used here

// Effects for Brand Builder cards
export const brandBuilderCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Brand Vision: Draw 1 card. If you control a Product, draw 2 instead.
  'brand_vision': (G, playerID) => {
    const player = G.players[playerID];
    drawCards(G, playerID, player.board.Products.length > 0 ? 2 : 1);
  },
  // Influencer Collab: Add 3 Audience. Gain 2 capital.
  'influencer_collab': (G, playerID) => {
    gainCapital(G, playerID, 2); // Placeholder for Audience
  },
  // Content Calendar: Recurring: Add 1 Audience at the start of your turn.
  'content_calendar': passiveEffect, // Placeholder for Audience
  // Viral Post: Add 5 Audience. If you've gained Audience this turn, gain 2 capital.
  'viral_post': (G, playerID) => {
    drawCards(G, playerID, 1); // Placeholder for Audience
    if ((G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0) >= 2) {
      gainCapital(G, playerID, 2);
    }
  },
  // Email List: Recurring: If you have 5+ Audience, gain 1 capital.
  'email_list': passiveEffect, // Placeholder for Audience
  // Visual Identity: Your Products cost 1 less if you have a Brand Effect.
  'visual_identity': passiveEffect,
  // Founder Story: Draw 2 cards. If you control an Employee, draw 3 instead.
  'founder_story': (G, playerID) => {
    const player = G.players[playerID];
    drawCards(G, playerID, player.board.Employees.length > 0 ? 3 : 2);
  },
  // Social Proof: Next time you gain capital this turn, gain 1 extra.
  'social_proof': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCapitalGain', 1);
  },
  // UGC Explosion: Double your Audience if you control a Product.
  'ugc_explosion': (G, playerID) => { // Placeholder for Audience
    if (G.players[playerID].board.Products.length > 0) {
      drawCards(G, playerID, 2);
    }
  },
  // Personal Branding: Whenever you play a Brand card, gain 1 Audience.
  'personal_branding': passiveEffect, // Placeholder for Audience
}; 