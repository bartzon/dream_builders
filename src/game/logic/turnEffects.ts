import type { GameState } from '../state';
import type { Card } from '../types';
import { drawCard } from '../logic';
import { sellProduct } from './cardEffects';

// Process passive effects at start of turn
export function processPassiveEffects(G: GameState, playerID: string) {
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
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 1;
    }
  }
  
  // Warehouse Manager effect - increase all inventories
  const warehouseManager = player.board.Employees.find(e => e.effect === 'warehouse_manager');
  if (warehouseManager) {
    player.board.Products.forEach(product => {
      if (product.inventory !== undefined) {
        product.inventory += 1;
      }
    });
  }
}

// Process overhead costs at start of turn
export function processOverheadCosts(G: GameState, playerID: string) {
  const player = G.players[playerID];
  
  // Check for Security Patch effect
  const securityPatch = player.board.Tools.find(t => t.effect === 'security_patch');
  const cannotDisable = !!securityPatch;
  
  // Check for Load Balancer and Patent Portfolio effects
  const loadBalancer = player.board.Tools.find(t => t.effect === 'load_balancer');
  const patentPortfolio = player.board.Tools.find(t => t.effect === 'patent_portfolio');
  const overheadReduction = (loadBalancer ? 1 : 0) + (patentPortfolio ? 1 : 0);
  
  // Process each product with overhead
  player.board.Products.forEach(product => {
    if (product.overheadCost && product.isActive) {
      const adjustedCost = Math.max(0, product.overheadCost - overheadReduction);
      
      if (adjustedCost > 0 && player.capital < adjustedCost) {
        // Can't pay overhead
        if (!cannotDisable) {
          product.isActive = false;
        }
      } else if (adjustedCost > 0) {
        // Pay overhead
        player.capital -= adjustedCost;
      }
    }
  });
}

// Process automatic sales at end of turn
export function processAutomaticSales(G: GameState, playerID: string) {
  const player = G.players[playerID];
  
  // Pop-up Shop effect - sell 1 item each turn
  const popupShop = player.board.Products.find(p => p.effect === 'popup_shop');
  if (popupShop && popupShop.inventory && popupShop.inventory > 0 && popupShop.isActive) {
    sellProduct(G, playerID, popupShop, 1);
  }
  
  // Automate Checkout effect - sell 1 additional product
  const automateCheckout = player.board.Tools.find(t => t.effect === 'automate_checkout');
  if (automateCheckout) {
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0 && p.isActive);
    if (product) {
      sellProduct(G, playerID, product, 1);
    }
  }
  
  // AI Salesbot effect - automatically sell 1 item
  const aiSalesbot = player.board.Employees.find(e => e.effect === 'ai_salesbot');
  if (aiSalesbot) {
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0 && p.isActive);
    if (product) {
      sellProduct(G, playerID, product, 1);
    }
  }
  
  // Delivery Drone Fleet effect - sell 1 additional item
  const deliveryDroneFleet = player.board.Tools.find(t => t.effect === 'delivery_drone_fleet');
  if (deliveryDroneFleet) {
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0 && p.isActive);
    if (product) {
      sellProduct(G, playerID, product, 1);
    }
  }
}

// Process recurring revenue effects (deprecated - now handled through sales)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function processRecurringRevenue(_G: GameState, _playerID: string) {
  // Most revenue now comes from actual product sales
  // This function is kept for compatibility but most effects moved to sales
}

// Get cost reduction for a card type
export function getCardDiscount(G: GameState, playerID: string, card: Card): number {
  const player = G.players[playerID];
  let discount = 0;
  
  // Check for next card discount
  if (G.effectContext?.[playerID]?.nextCardDiscount) {
    discount += G.effectContext[playerID].nextCardDiscount || 0;
    // Clear the discount after use
    G.effectContext[playerID].nextCardDiscount = 0;
  }
  
  // Brand Ambassador effect - Actions cost 1 less
  if (card.type === 'Action') {
    const brandAmbassador = player.board.Employees.find(e => e.effect === 'brand_ambassador');
    if (brandAmbassador) discount += 1;
    
    const customerSupport = player.board.Employees.find(e => e.effect === 'customer_support_team');
    if (customerSupport) discount += 1;
  }
  
  return Math.min(discount, card.cost); // Can't reduce below 0
}

// Handle card play effects
export function handleCardPlayEffects(G: GameState, playerID: string, card: Card) {
  const player = G.players[playerID];
  const ctx = G.effectContext?.[playerID];
  
  // Track card types played
  if (ctx) {
    if (card.type === 'Action') {
      ctx.playedActionThisTurn = true;
      ctx.playedActionsThisTurn = (ctx.playedActionsThisTurn || 0) + 1;
      
      // Visionary Conference effect - gain money when playing actions
      const visionaryConf = player.board.Tools.find(t => t.effect === 'visionary_conference');
      if (visionaryConf) {
        player.revenue += 25000;
        G.teamRevenue += 25000;
      }
      
      // Innovation Lab effect - draw when playing actions
      const innovationLab = player.board.Tools.find(t => t.effect === 'innovation_lab');
      if (innovationLab) {
        drawCard(player);
      }
      
      // Thought Leadership effect - add revenue to action
      if (ctx.nextActionRevenue && ctx.nextActionRevenue > 0) {
        player.revenue += ctx.nextActionRevenue;
        G.teamRevenue += ctx.nextActionRevenue;
        ctx.nextActionRevenue = 0;
      }
    }
    
    if (card.type === 'Tool') {
      ctx.playedToolThisTurn = true;
    }
    
    if (card.type === 'Product') {
      ctx.firstProductPlayed = true;
    }
  }
} 