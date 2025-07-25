import type { GameState } from '../../state';
import type { Card } from '../../types';
import {
  ensureEffectContext,
  drawCards,
} from '../utils/effect-helpers';
// import {
//   addInventoryToSpecificProduct // No longer used here
// } from '../utils/inventory-helpers';
import {
  createProductChoice,
  addPendingChoice
} from '../utils/choice-helpers';
import { drawCard } from '../utils/deck-helpers';
// import {
//   sellProduct, // No longer used here
// } from '../utils/sales-helpers';

// Effects for Inventory Support cards
export const inventorySupportCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Bulk Order Deal: Choose a Product. Add +2 inventory.
  'add_inventory_to_product': (G, playerID) => {
    createProductChoice(G.players[playerID], 'add_inventory_to_product');
  },
  // Reorder Notification: Choose a Product with 0 inventory. Add +3 inventory.
  'add_inventory_if_empty': (G, playerID) => {
    createProductChoice(G.players[playerID], 'add_inventory_if_empty', p => p.inventory === 0);
  },
  // Dropship Restock: All Products with less than 2 inventory gain +1.
  'add_inventory_to_low_stock': (G, playerID) => {
    G.players[playerID].board.Products.forEach((product: Card) => {
      if (product.inventory !== undefined && product.inventory < 2 && product.isActive !== false) product.inventory += 1;
    });
  },
  // Warehouse Expansion: Choose up to 3 Products. Add +1 inventory to each.
  'multi_product_inventory_boost': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter((p: Card) => p.isActive !== false);
    if (products.length === 0) return;
    const ctx = ensureEffectContext(G, playerID);
    ctx.warehouseExpansionCount = 0;
    addPendingChoice(player, {
      type: 'choose_card',
      effect: 'multi_product_inventory_boost',
      cards: products.map((p: Card) => ({ ...p })),
    });
  },
  // Viral Unboxing Video: Choose a Product. Add +1 inventory and +1 sale this turn.
  'inventory_and_sale_boost': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter((p: Card) => p.isActive !== false && p.inventory !== undefined);
    if (products.length > 0) {
      addPendingChoice(player, {
        type: 'choose_card',
        effect: 'inventory_and_sale_boost',
        cards: products.map((p: Card) => ({ ...p })),
      });
    }
  },
  // Supplier Collab: Choose a Product. Add +2 inventory. Its next sale earns +1000.
  'inventory_boost_plus_revenue': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter((p: Card) => p.isActive !== false);
    if (products.length > 0) {
      addPendingChoice(player, {
        type: 'choose_card',
        effect: 'inventory_boost_plus_revenue',
        cards: products.map((p: Card) => ({ ...p })),
      });
    }
  },
  // Fulfillment App Integration: At the start of your next 2 turns, add +1 inventory to a random Product.
  'delayed_inventory_boost': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.delayedInventoryBoostTurns = 2;
  },
  // Inventory Forecast Tool: Draw 1. Then choose a Product to gain +1 inventory.
  'draw_and_inventory': (G, playerID) => {
    drawCards(G, playerID, 1, 'Inventory Forecast Tool');
    createProductChoice(G.players[playerID], 'draw_and_inventory');
  },
  // Last-Minute Restock: Choose any Product. Add +1 inventory.
  'simple_inventory_boost': (G, playerID) => createProductChoice(G.players[playerID], 'simple_inventory_boost'),
  'factory_direct': (G, playerID) => {
    const player = G.players[playerID];
    
    const productsOnBoard = player.board.Products.filter(p => p.isActive !== false);
    if (productsOnBoard.length > 0) {
      addPendingChoice(player, {
        type: 'choose_card',
        effect: 'inventory_boost_plus_revenue',
        cards: productsOnBoard.map(p => ({ ...p })), 
      });
    }
  },
  'fulfillment_center': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player, 'Fulfillment Center', G.gameLog);
    const productsOnBoard = player.board.Products.filter(p => p.isActive !== false);
    if (productsOnBoard.length > 0) {
      addPendingChoice(player, {
        type: 'choose_card',
        effect: 'draw_and_inventory',
        cards: productsOnBoard.map(p => ({ ...p })), 
      });
    }
  },
  'warehouse_expansion': (G, playerID) => {
    const player = G.players[playerID];
    const productsOnBoard = player.board.Products.filter(p => p.isActive !== false);
    if (productsOnBoard.length > 0) {
      const ctx = ensureEffectContext(G, playerID);
      ctx.warehouseExpansionCount = 0;
      addPendingChoice(player, {
        type: 'choose_card',
        effect: 'multi_product_inventory_boost',
        cards: productsOnBoard.map(p => ({ ...p })), 
      });
    }
  },
}; 