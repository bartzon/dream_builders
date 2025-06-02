import type { GameState } from '../../state';
import { drawCard } from '../utils/deck-helpers';

export function handleBrandBuilderPassives(G: GameState, playerID: string): void {
  const player = G.players[playerID];
  const ctx = G.effectContext?.[playerID];

  // Content Calendar: Recurring: Add 1 inventory to your lowest-inventory Product.
  const contentCalendar = player.board.Tools.find(t => t.effect === 'content_calendar');
  if (contentCalendar) {
    const productsWithInventory = player.board.Products.filter(
      p => p.inventory !== undefined && p.isActive !== false
    );
    
    if (productsWithInventory.length > 0) {
      // Find the product with the lowest inventory
      let lowestProduct = productsWithInventory[0];
      for (const product of productsWithInventory) {
        if (product.inventory !== undefined && lowestProduct.inventory !== undefined) {
          if (product.inventory < lowestProduct.inventory) {
            lowestProduct = product;
          }
        }
      }
      
      if (lowestProduct.inventory !== undefined) {
        lowestProduct.inventory += 1;
        
        // Track affected card for UI highlighting
        if (ctx) {
          if (!ctx.recentlyAffectedCardIds) {
            ctx.recentlyAffectedCardIds = [];
          }
          ctx.recentlyAffectedCardIds.push(lowestProduct.id);
        }
        
        if (G.gameLog) {
          G.gameLog.push(`Content Calendar: Added +1 inventory to ${lowestProduct.name}.`);
        }
      }
    }
  }

  // Email List: Recurring: If you control 2+ Products, gain 1 capital.
  const emailList = player.board.Tools.find(t => t.effect === 'email_list');
  if (emailList) {
    if (player.board.Products.length >= 2) {
      player.capital = Math.min(10, player.capital + 1);
      
      if (G.gameLog) {
        G.gameLog.push('Email List: Gained +1 capital for controlling 2+ Products.');
      }
    }
  }

  // Personal Branding: Recurring: Draw 1 card if you played an Action last turn.
  const personalBranding = player.board.Tools.find(t => t.effect === 'personal_branding');
  if (personalBranding && ctx?.playedActionLastTurn) {
    drawCard(player, 'Personal Branding', G.gameLog);
  }
} 