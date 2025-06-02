import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  gainCapital,
  drawCards
} from '../utils/effect-helpers';

const passiveEffect = () => {}; // Define passiveEffect if it's used here

// Effects for Brand Builder cards
export const brandBuilderCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Brand Vision: Draw 1 card. If you control a Product, draw 2 instead.
  'brand_vision': (G, playerID) => {
    const player = G.players[playerID];
    drawCards(G, playerID, player.board.Products.length > 0 ? 2 : 1, 'Brand Vision');
  },
  // Influencer Collab: If you control a Product, gain 3 capital.
  'influencer_collab': (G, playerID) => {
    const player = G.players[playerID];
    if (player.board.Products.length > 0) {
      gainCapital(G, playerID, 3);
      if (G.gameLog) G.gameLog.push('Influencer Collab: Gained 3 capital (control a Product)');
    } else {
      if (G.gameLog) G.gameLog.push('Influencer Collab: No effect (no Products controlled)');
    }
  },
  // Content Calendar: Recurring: Add 1 Audience at the start of your turn.
  'content_calendar': passiveEffect, // Placeholder for Audience
  // Viral Post: If you played another Action this turn, gain 2 capital. Otherwise, draw 1 card.
  'viral_post': (G, playerID) => {
    const ctx = G.effectContext?.[playerID];
    const actionsPlayedThisTurn = ctx?.playedActionsThisTurn || 0;
    
    // Check if another Action was played this turn (not counting this one)
    if (actionsPlayedThisTurn > 1) {
      gainCapital(G, playerID, 2);
      if (G.gameLog) G.gameLog.push('Viral Post: Gained 2 capital (played another Action this turn)');
    } else {
      drawCards(G, playerID, 1, 'Viral Post');
    }
  },
  // Email List: Recurring: If you have 5+ Audience, gain 1 capital.
  'email_list': passiveEffect, // Placeholder for Audience
  // Visual Identity: Your Products cost 1 less if you have a Brand Effect.
  'visual_identity': passiveEffect,
  // Founder Story: Draw 2 cards. If you control an Employee, draw 3 instead.
  'founder_story': (G, playerID) => {
    const player = G.players[playerID];
    drawCards(G, playerID, player.board.Employees.length > 0 ? 3 : 2, 'Founder Story');
  },
  // Social Proof: Next time you gain revenue this turn, gain +25% extra.
  'social_proof': (G, playerID) => {
    // This sets up a flag to boost the next revenue gain (persists until used)
    const ctx = G.effectContext?.[playerID];
    if (ctx) {
      ctx.nextRevenueGainMultiplier = 1.25; // 25% extra means multiply by 1.25
      if (G.gameLog) G.gameLog.push('Social Proof: Next revenue gain will be +25% extra (persists until used)');
    }
  },
  // UGC Explosion: Add 3 inventory to each Product you control.
  'ugc_explosion': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter(p => p.isActive !== false);
    
    products.forEach(product => {
      if (product.inventory !== undefined) {
        product.inventory += 3;
        
        // Track affected cards for UI
        if (G.effectContext?.[playerID]) {
          if (!G.effectContext[playerID].recentlyAffectedCardIds) {
            G.effectContext[playerID].recentlyAffectedCardIds = [];
          }
          G.effectContext[playerID].recentlyAffectedCardIds.push(product.id);
        }
      }
    });
    
    if (G.gameLog && products.length > 0) {
      G.gameLog.push(`UGC Explosion: Added 3 inventory to ${products.length} product${products.length !== 1 ? 's' : ''}`);
    }
  },
  // Personal Branding: Whenever you play a Brand card, gain 1 Audience.
  'personal_branding': passiveEffect, // Placeholder for Audience
}; 