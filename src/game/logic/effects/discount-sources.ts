import type { GameState, PlayerState } from '../../state';
import type { Card } from '../../types';

// Discount source: Next Card Discount (general temporary bonus)
export function getNextCardDiscount(G: GameState, playerID: string, forApplying: boolean): number {
  let discount = 0;
  if (G.effectContext?.[playerID]?.nextCardDiscount) {
    discount += G.effectContext[playerID].nextCardDiscount || 0;
    if (forApplying && G.effectContext?.[playerID]) {
      G.effectContext[playerID].nextCardDiscount = 0; // Clear after application
    }
  }
  return discount;
}

// Discount source: Brand Ambassador & Customer Support (for Actions)
export function getActionCardSynergyDiscount(player: PlayerState, card: Card): number {
  let discount = 0;
  if (card.type === 'Action') {
    if (player.board.Employees.find(e => e.effect === 'brand_ambassador')) discount += 1;
    if (player.board.Employees.find(e => e.effect === 'customer_support_team')) discount += 1;
  }
  return discount;
}

// Discount source: Solo Hustler specific card & DIY Assembly (for Products)
export function getProductSynergyDiscount(G: GameState, playerID: string, player: PlayerState, card: Card, forApplying: boolean): number {
  let discount = 0;
  if (card.type === 'Product') {
    // Specific card from Solo Hustler hero power
    if (card.id && G.effectContext?.[playerID]?.soloHustlerDiscountedCard === card.id) {
      discount += 1;
      if (forApplying && G.effectContext?.[playerID]) {
        G.effectContext[playerID].soloHustlerDiscountedCard = undefined; // Clear after application
      }
    }
    // DIY Assembly tool
    if (player.board.Tools.find(t => t.effect === 'diy_assembly')) discount += 1;
  }
  return discount;
}

// Discount source: Meme Magic (Community Leader card)
export function getMemeMagicDiscount(G: GameState, playerID: string, card: Card): number {
  if (card.effect === 'meme_magic') {
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      return card.cost; // Makes it cost 0
    }
  }
  return 0;
}

// Cost Increase: Quality Materials (Brand Builder card, acts as negative discount)
export function getQualityMaterialsCostIncrease(player: PlayerState, card: Card): number {
  if (card.type === 'Product') {
    if (player.board.Tools.find(t => t.effect === 'quality_materials')) return -1; // Negative discount = cost increase
  }
  return 0;
}

// Cost Reduction: Visual Identity (Brand Builder card)
export function getVisualIdentityDiscount(player: PlayerState, card: Card): number {
  if (card.type === 'Product') {
    const visualIdentity = player.board.Tools.find(t => t.effect === 'visual_identity');
    if (visualIdentity) {
      // Check if player controls another Tool (besides Visual Identity itself)
      const otherTools = player.board.Tools.filter(t => t.id !== visualIdentity.id);
      if (otherTools.length > 0) {
        return 1; // Products cost 1 less
      }
    }
  }
  return 0;
}

// Discount source: Shoestring Budget (Solo Hustler Tool)
export function getShoestringBudgetDiscount(G: GameState, playerID: string, player: PlayerState): number {
  let discount = 0;
  const shoestringBudgetTool = player.board.Tools.find(t => t.effect === 'shoestring_budget');
  if (shoestringBudgetTool && G.effectContext?.[playerID] && 
      (!G.effectContext[playerID].cardsPlayedThisTurn || G.effectContext[playerID].cardsPlayedThisTurn === 0)) {
    discount += 1;
    // The cardsPlayedThisTurn check inherently handles the "first card" logic now.
  }
  return discount;
}

// Discount source: Community Manager (Employee)
// Your Tools and Actions cost 1 less.
export function getCommunityManagerDiscount(player: PlayerState, cardToPlay: Card): number {
  const communityManager = player.board.Employees.find(e => e.effect === 'community_manager');
  if (communityManager && (cardToPlay.type === 'Tool' || cardToPlay.type === 'Action')) {
    return 1;
  }
  return 0;
} 