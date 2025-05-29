import type { GameState } from '../state';
import type { Card } from '../types';
import { drawCard } from './utils';
import { initEffectContext } from './effectContext';

// Helper function to sell a product
export function sellProduct(G: GameState, playerID: string, product: Card, quantity: number = 1): number {
  if (!product.inventory || product.inventory < quantity) return 0;
  
  const player = G.players[playerID];
  const baseRevenue = (product.revenuePerSale || 0) * quantity;
  let totalRevenue = baseRevenue;
  
  // Apply any revenue modifiers
  const ctx = G.effectContext?.[playerID];
  if (ctx) {
    // Flash Sale Frenzy effect
    if (ctx.flashSaleActive) {
      totalRevenue += 50000 * quantity;
    }
    
    // Limited Time Offer effect
    if (ctx.nextProductBonus && ctx.nextProductBonus > 0) {
      totalRevenue += ctx.nextProductBonus;
      ctx.nextProductBonus = 0;
    }
    
    // Social Media Ads effect
    const socialMediaAds = player.board.Tools.find(t => t.effect === 'social_media_ads');
    if (socialMediaAds) {
      totalRevenue += 10000 * quantity;
    }
    
    // Global Supply Network effect
    const globalSupply = player.board.Tools.find(t => t.effect === 'global_supply_network');
    if (globalSupply) {
      totalRevenue += 20000 * quantity;
    }
    
    // Packaging Upgrade effect
    const packaging = player.board.Tools.find(t => t.effect === 'packaging_upgrade');
    if (packaging) {
      totalRevenue += 10000 * quantity;
    }
    
    // Scaling Algorithm effect (Developer)
    const scalingAlgo = player.board.Tools.find(t => t.effect === 'scaling_algorithm');
    if (scalingAlgo) {
      totalRevenue *= 2;
    }
  }
  
  // Update inventory
  product.inventory -= quantity;
  
  // Update revenue
  player.revenue += totalRevenue;
  G.teamRevenue += totalRevenue;
  
  // Trigger on-sale effects
  
  // Sales Closer effect
  const salesCloser = player.board.Employees.find(e => e.effect === 'sales_closer');
  if (salesCloser) {
    player.revenue += 20000;
    G.teamRevenue += 20000;
  }
  
  // Loyalty Program effect
  const loyaltyProgram = player.board.Tools.find(t => t.effect === 'loyalty_program');
  if (loyaltyProgram) {
    player.revenue += 15000;
    G.teamRevenue += 15000;
  }
  
  // Logistics Specialist effect
  const logisticsSpec = player.board.Employees.find(e => e.effect === 'logistics_specialist');
  if (logisticsSpec) {
    player.revenue += 15000;
    G.teamRevenue += 15000;
    // Restore 1 inventory
    if (product.inventory !== undefined) {
      product.inventory += 1;
    }
  }
  
  // Investor Network effect
  const investorNetwork = player.board.Employees.find(e => e.effect === 'investor_network');
  if (investorNetwork) {
    player.revenue += 50000;
    G.teamRevenue += 50000;
    drawCard(player);
  }
  
  // Open Source SDK effect
  const openSourceSDK = player.board.Tools.find(t => t.effect === 'open_source_sdk');
  if (openSourceSDK) {
    drawCard(player);
  }
  
  // Mark that a product was sold this turn
  if (ctx) {
    ctx.soldProductThisTurn = true;
  }
  
  return totalRevenue;
}

// Card Effects Registry
export const cardEffects: Record<string, (G: GameState, playerID: string, card: Card) => void> = {
  // === MARKETER EFFECTS ===
  'flash_sale_frenzy': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].flashSaleActive = true;
  },
  
  'popup_shop': () => {
    // Passive effect - handled in turn processing
  },
  
  'sales_closer': () => {
    // Triggered effect - handled in sellProduct
  },
  
  'social_media_ads': () => {
    // Passive effect - handled in sellProduct
  },
  
  'mega_launch_event': (G, playerID, card) => {
    // Check if an Action was played this turn
    const ctx = G.effectContext?.[playerID];
    const actionPlayed = ctx?.playedActionsThisTurn && ctx.playedActionsThisTurn > 0;
    
    if (actionPlayed && card.revenuePerSale) {
      // Temporarily boost the revenue for this product
      card.revenuePerSale += 50000;
    }
  },
  
  'limited_time_offer': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].nextProductBonus = 40000;
  },
  
  'viral_campaign': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
    drawCard(player);
    
    // Check if sold a product last turn
    const ctx = G.effectContext?.[playerID];
    if (ctx?.soldProductLastTurn) {
      player.revenue += 50000;
      G.teamRevenue += 50000;
    }
  },
  
  'loyalty_program': () => {
    // Passive effect - handled in sellProduct
  },
  
  'influencer_partnership': () => {
    // Passive effect - handled in turn processing
  },
  
  'popup_market_stall': () => {
    // No special effect, just a basic product
  },
  
  'email_blast': (G, playerID) => {
    const player = G.players[playerID];
    // Find a product with inventory
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product) {
      sellProduct(G, playerID, product, 1);
    }
  },
  
  'brand_ambassador': () => {
    // Passive effect - handled when playing actions
  },
  
  'ad_budget_boost': () => {
    // Passive effect - handled in turn processing
  },
  
  'seasonal_sale': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose which product
    // For now, sell all inventory from first product with inventory
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product && product.inventory) {
      const quantity = product.inventory;
      sellProduct(G, playerID, product, quantity);
      // Add bonus revenue
      player.revenue += 10000 * quantity;
      G.teamRevenue += 10000 * quantity;
    }
  },
  
  'flash_mob_event': (G, playerID, card) => {
    // Check if an Action was played this turn
    const ctx = G.effectContext?.[playerID];
    const actionPlayed = ctx?.playedActionsThisTurn && ctx.playedActionsThisTurn > 0;
    
    if (actionPlayed && card.revenuePerSale) {
      // Double revenue for this sale
      card.revenuePerSale *= 2;
    }
  },
  
  // === DEVELOPER EFFECTS ===
  'automate_checkout': () => {
    // Passive effect - handled in turn processing
  },
  
  'scaling_algorithm': () => {
    // Passive effect - handled in sellProduct
  },
  
  'bug_fix_sprint': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 2;
    }
  },
  
  'ai_optimization': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product) {
      sellProduct(G, playerID, product, 1);
      // Add bonus revenue
      player.revenue += 100000;
      G.teamRevenue += 100000;
    }
  },
  
  'saas_platform': () => {
    // Passive effect with overhead - handled in turn processing
  },
  
  'code_refactor': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 3;
    }
  },
  
  'beta_tester_squad': () => {
    // Passive effect - handled in turn processing
  },
  
  'load_balancer': () => {
    // Passive effect - reduces overhead costs
  },
  
  'cloud_infrastructure': () => {
    // No special effect, just a basic product
  },
  
  'debug_sprint': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 2;
    }
  },
  
  'ai_salesbot': () => {
    // Passive effect - handled in turn processing
  },
  
  'continuous_deployment': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].extraActionPlays = (G.effectContext[playerID].extraActionPlays || 0) + 1;
  },
  
  'security_patch': () => {
    // Passive effect - prevents product disabling
  },
  
  'open_source_sdk': () => {
    // Passive effect - handled in sellProduct
  },
  
  'tech_conference': (G, playerID, card) => {
    // Check if sold an Action this turn (doesn't make sense, might be "played")
    const ctx = G.effectContext?.[playerID];
    const actionPlayed = ctx?.playedActionsThisTurn && ctx.playedActionsThisTurn > 0;
    
    if (actionPlayed && card.revenuePerSale) {
      // Add bonus revenue per item
      card.revenuePerSale += 40000;
    }
  },
  
  // === OPERATOR EFFECTS ===
  'fulfillment_center': (G, playerID, card) => {
    // Check if 2+ items sold this turn
    const ctx = G.effectContext?.[playerID];
    if (ctx?.itemsSoldThisTurn && ctx.itemsSoldThisTurn >= 2 && card.revenuePerSale) {
      card.revenuePerSale += 30000;
    }
  },
  
  'logistics_specialist': () => {
    // Triggered effect - handled in sellProduct
  },
  
  'express_shipping': (G, playerID) => {
    const player = G.players[playerID];
    // Find a product with inventory
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product) {
      sellProduct(G, playerID, product, 1);
    }
  },
  
  'global_supply_network': () => {
    // Passive effect - handled in sellProduct
  },
  
  'automation_hub': (G, playerID) => {
    // In full implementation, player would choose a lane
    // For now, sell 1 from each product
    const player = G.players[playerID];
    player.board.Products.forEach(product => {
      if (product.inventory && product.inventory > 0) {
        sellProduct(G, playerID, product, 1);
      }
    });
  },
  
  'warehouse_manager': () => {
    // Passive effect - handled in turn processing
  },
  
  'delivery_drone_fleet': () => {
    // Passive effect - handled in turn processing
  },
  
  'stock_replenishment': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 4;
    }
  },
  
  'quality_control': (G, playerID) => {
    const player = G.players[playerID];
    // Find a product with inventory
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product) {
      sellProduct(G, playerID, product, 1);
      // Add bonus revenue
      player.revenue += 25000;
      G.teamRevenue += 25000;
    }
  },
  
  'supply_chain_expansion': () => {
    // No special effect, just a basic product
  },
  
  'customer_support_team': () => {
    // Passive effect - handled when playing actions
  },
  
  'packaging_upgrade': () => {
    // Passive effect - handled in sellProduct
  },
  
  'express_returns': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory !== undefined);
    if (product && product.inventory !== undefined) {
      product.inventory += 2;
    }
  },
  
  'inventory_forecast': () => {
    // Passive effect - handled in turn processing
  },
  
  'regional_warehouse': () => {
    // No special effect, just a basic product
  },
  
  // === VISIONARY EFFECTS ===
  'disruptive_pivot': (G, playerID) => {
    // Double all revenue gained from sales this turn
    const ctx = G.effectContext?.[playerID];
    if (ctx) {
      ctx.doubleRevenueThisTurn = true;
    }
  },
  
  'moonshot_rd': () => {
    // Passive effect with overhead - handled in turn processing
  },
  
  'investor_network': () => {
    // Triggered effect - handled in sellProduct
  },
  
  'series_a_funding': (G, playerID) => {
    const player = G.players[playerID];
    player.revenue += 200000;
    G.teamRevenue += 200000;
  },
  
  'visionary_conference': () => {
    // Triggered effect - handled when playing actions
  },
  
  'futuristic_prototype': (G, playerID, card) => {
    // Check if sold an Action this turn (might mean "played")
    const ctx = G.effectContext?.[playerID];
    const actionPlayed = ctx?.playedActionsThisTurn && ctx.playedActionsThisTurn > 0;
    
    if (actionPlayed && card.revenuePerSale) {
      // Double revenue
      card.revenuePerSale *= 2;
    }
  },
  
  'innovation_lab': () => {
    // Triggered effect - handled when playing actions
  },
  
  'venture_capitalist': () => {
    // Passive effect - handled in turn processing
  },
  
  'market_disruptor': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product && product.inventory) {
      const quantity = product.inventory;
      product.inventory = 0;
      const revenue = 50000 * quantity;
      player.revenue += revenue;
      G.teamRevenue += revenue;
    }
  },
  
  'strategic_partnership': () => {
    // Passive effect - all employees gain revenue when selling
    // Complex to implement, would need to track employee effects
  },
  
  'patent_portfolio': () => {
    // Passive effect - reduces overhead costs
  },
  
  'tech_incubator': () => {
    // Special product - can sell multiple items without overhead
  },
  
  'accelerator_program': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
    drawCard(player);
    player.capital = Math.min(10, player.capital + 1);
  },
  
  'thought_leadership': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].nextActionRevenue = 30000;
  },
  
  'global_launch_event': () => {
    // Can only be played if two actions played - handled in game logic
  },
}; 