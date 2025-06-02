import type { GameState } from '../../state';
import { drawCard } from './deck-helpers'; // Updated import path
import { initEffectContext as initializePlayerEffectContext } from '../effectContext'; // Renaming for clarity

// ==========================================
// CORE HELPER FUNCTIONS
// ==========================================

export function ensureEffectContext(G: GameState, playerID: string) {
  if (!G.effectContext) G.effectContext = {};
  if (!G.effectContext[playerID]) G.effectContext[playerID] = initializePlayerEffectContext();
  return G.effectContext[playerID];
}

export function gainCapital(G: GameState, playerID: string, amount: number) {
  const player = G.players[playerID];
  player.capital = Math.min(10, player.capital + amount);
}

export function gainRevenue(G: GameState, playerID: string, amount: number) {
  const player = G.players[playerID];
  const ctx = G.effectContext?.[playerID];
  
  let finalAmount = amount;
  
  // Apply revenue multiplier if any (e.g., from Social Proof)
  if (ctx && ctx.nextRevenueGainMultiplier && ctx.nextRevenueGainMultiplier !== 1) {
    finalAmount = Math.floor(amount * ctx.nextRevenueGainMultiplier);
    if (G.gameLog) {
      const percentBoost = Math.round((ctx.nextRevenueGainMultiplier - 1) * 100);
      G.gameLog.push(`Revenue boosted by ${percentBoost}%: $${amount.toLocaleString()} → $${finalAmount.toLocaleString()}`);
    }
    // Reset the multiplier after use
    ctx.nextRevenueGainMultiplier = 1;
  }
  
  player.revenue += finalAmount;
}

export function drawCards(G: GameState, playerID: string, count: number, reason?: string) {
  const player = G.players[playerID];
  for (let i = 0; i < count; i++) {
    drawCard(player, reason, G.gameLog); // Now correctly uses drawCard from deck-helpers
  }
}

// ==========================================
// BONUS APPLICATION HELPERS
// ==========================================

export function applyTemporaryBonus(G: GameState, playerID: string, bonusType: string, amount: number) {
  const ctx = ensureEffectContext(G, playerID); // Uses the ensureEffectContext from this file
  switch (bonusType) {
    case 'nextProductBonus':
      ctx.nextProductBonus = amount;
      break;
    case 'nextCardDiscount':
      ctx.nextCardDiscount = amount;
      break;
    case 'nextProductDiscount':
      ctx.nextProductDiscount = amount;
      break;
    case 'extraActionPlays':
      ctx.extraActionPlays = (ctx.extraActionPlays || 0) + amount;
      break;
    case 'extraCardPlays':
      ctx.extraCardPlays = (ctx.extraCardPlays || 0) + amount;
      break;
    case 'nextActionRevenue':
      ctx.nextActionRevenue = amount;
      break;
  }
} 