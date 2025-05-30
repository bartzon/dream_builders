import type { GameState } from '../../state';
import type { Card } from '../../types'; // May not be needed if only accessing player state

export function handleLegacyPassiveEffects(G: GameState, playerID: string): void {
  const player = G.players[playerID];

  // Ad Budget Boost effect - extra capital per turn
  const adBudgetBoost = player.board.Tools.find(t => t.effect === 'ad_budget_boost');
  if (adBudgetBoost) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Inventory Forecast effect - capital per product
  const inventoryForecast = player.board.Tools.find(t => t.effect === 'inventory_forecast');
  if (inventoryForecast) {
    const productCount = player.board.Products.length;
    player.capital = Math.min(10, player.capital + productCount);
  }
  
  // Beta Tester Squad effect - gain capital if sold product last turn
  const betaTesterSquad = player.board.Employees.find(e => e.effect === 'beta_tester_squad');
  if (betaTesterSquad && G.effectContext?.[playerID]?.soldProductLastTurn) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Venture Capitalist effect - gain 2 capital each turn
  const ventureCapitalist = player.board.Employees.find(e => e.effect === 'venture_capitalist');
  if (ventureCapitalist) {
    player.capital = Math.min(10, player.capital + 2);
  }
  
  // Influencer Partnership effect - increase inventory
  const influencerPartnership = player.board.Employees.find(e => e.effect === 'influencer_partnership');
  if (influencerPartnership) {
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 1;
    }
  }
  
  // Warehouse Manager effect - increase all inventories
  const warehouseManager = player.board.Employees.find(e => e.effect === 'warehouse_manager');
  if (warehouseManager) {
    player.board.Products.forEach((product: Card) => { // Added Card type
      if (product.inventory !== undefined) {
        product.inventory += 1;
      }
    });
  }
} 