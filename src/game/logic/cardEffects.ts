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
    
    // === NEW APPEAL SYSTEM (Brand Builder) ===
    
    // Apply Appeal bonuses
    if (product.appeal && product.appeal > 0) {
      totalRevenue += product.appeal * 5000 * quantity; // $5k per Appeal per item
    }
    
    // Global Appeal boost from hero power or Brand Story
    if (ctx.globalAppealBoost) {
      totalRevenue += ctx.globalAppealBoost * 5000 * quantity;
    }
  }
  
  // Update inventory
  product.inventory -= quantity;
  
  // Update revenue
  player.revenue += totalRevenue;
  
  // Trigger the product's own sale effect
  if (product.effect && cardEffects[product.effect]) {
    cardEffects[product.effect](G, playerID, product);
  }
  
  // Trigger on-sale effects
  
  // Sales Closer effect
  const salesCloser = player.board.Employees.find(e => e.effect === 'sales_closer');
  if (salesCloser) {
    player.revenue += 20000;
  }
  
  // Loyalty Program effect
  const loyaltyProgram = player.board.Tools.find(t => t.effect === 'loyalty_program');
  if (loyaltyProgram) {
    player.revenue += 15000;
  }
  
  // Logistics Specialist effect
  const logisticsSpec = player.board.Employees.find(e => e.effect === 'logistics_specialist');
  if (logisticsSpec) {
    // Restore 1 inventory
    if (product.inventory !== undefined) {
      product.inventory += 1;
    }
  }
  
  // Investor Network effect
  const investorNetwork = player.board.Employees.find(e => e.effect === 'investor_network');
  if (investorNetwork) {
    drawCard(player);
  }
  
  // Open Source SDK effect
  const openSourceSDK = player.board.Tools.find(t => t.effect === 'open_source_sdk');
  if (openSourceSDK) {
    drawCard(player);
  }
  
  // === NEW ON-SALE EFFECTS ===
  
  // Brand Ambassador effect - other Products gain Appeal
  const brandAmbassadorNew = player.board.Employees.find(e => e.effect === 'brand_ambassador_new');
  if (brandAmbassadorNew) {
    player.board.Products.forEach(otherProduct => {
      if (otherProduct !== product && otherProduct.appeal !== undefined) {
        otherProduct.appeal = (otherProduct.appeal || 0) + 1;
      } else if (otherProduct !== product) {
        otherProduct.appeal = 1;
      }
    });
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

  // === SOLO HUSTLER EFFECTS ===
  'hustle_hard': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
    drawCard(player);
    player.capital = Math.min(10, player.capital + 1);
  },

  'bootstrap_capital': (G, playerID) => {
    const player = G.players[playerID];
    player.capital = Math.min(10, player.capital + 2);
  },

  'diy_assembly': () => {
    // Passive effect - reduces Product costs by 1
  },

  'fast_pivot': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].extraCardPlays = (G.effectContext[playerID].extraCardPlays || 0) + 1;
  },

  'freelancer_network': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
    drawCard(player);
  },

  'resourceful_solutions': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].nextCardDiscount = 2;
  },

  'scrappy_marketing': (G, playerID) => {
    const player = G.players[playerID];
    const hasProduct = player.board.Products.length > 0;
    if (hasProduct) {
      drawCard(player);
      drawCard(player);
    }
  },

  'midnight_oil': (G, playerID) => {
    const player = G.players[playerID];
    
    // Draw 3 cards
    drawCard(player);
    drawCard(player);
    drawCard(player);
    
    // Set a flag to indicate we need to discard after drawing
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].midnightOilDiscardPending = true;
  },

  // === BRAND BUILDER EFFECTS ===
  'brand_story': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].globalAppealBoost = 1;
  },

  'community_manager': () => {
    // Passive effect - handled in sellProduct
  },

  'design_workshop': () => {
    // Passive effect - new Products enter with +1 Appeal
  },

  'storytelling_campaign': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products[0];
    if (product && product.appeal !== undefined) {
      product.appeal = (product.appeal || 0) + 2;
    }
  },

  'brand_ambassador_new': () => {
    // Passive effect - when selling Products, other Products gain Appeal
  },

  'quality_materials': () => {
    // Passive effect - Products cost 1 more but gain +1 Appeal
  },

  'flagship_store': (G, playerID, card) => {
    // Revenue increases based on total Appeal
    const player = G.players[playerID];
    let totalAppeal = 0;
    player.board.Products.forEach(product => {
      totalAppeal += product.appeal || 0;
    });
    if (card.revenuePerSale) {
      card.revenuePerSale += totalAppeal * 5000;
    }
  },

  'brand_recognition': (G, playerID) => {
    const player = G.players[playerID];
    let totalAppeal = 0;
    player.board.Products.forEach(product => {
      totalAppeal += product.appeal || 0;
    });
    for (let i = 0; i < totalAppeal; i++) {
      drawCard(player);
    }
  },

  // === AUTOMATION ARCHITECT EFFECTS ===
  'basic_script': () => {
    // Passive effect - gain 1 capital each turn
  },

  'automated_pipeline': () => {
    // Passive effect - automatically sell 1 item from each Product each turn
  },

  'server_farm': () => {
    // Passive effect - generates passive income
  },

  'code_deployment': (G, playerID) => {
    const player = G.players[playerID];
    // Play a Tool from hand for free
    const toolInHand = player.hand.find(card => card.type === 'Tool');
    if (toolInHand) {
      const toolIndex = player.hand.indexOf(toolInHand);
      player.hand.splice(toolIndex, 1);
      player.board.Tools.push(toolInHand);
      
      // Execute Tool effect if it has one
      if (toolInHand.effect && cardEffects[toolInHand.effect]) {
        cardEffects[toolInHand.effect](G, playerID, toolInHand);
      }
    }
  },

  'process_optimization': () => {
    // Passive effect - reduce all overhead costs by 1
  },

  'ml_model': () => {
    // Passive effect - gain capital equal to number of Tools each turn
  },

  'scheduled_task': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].recurringCapitalNextTurn = 
      (G.effectContext[playerID].recurringCapitalNextTurn || 0) + 1;
  },

  'cloud_service': (_G, _playerID, card) => {
    // Revenue doubles each time it's sold
    if (card.revenuePerSale) {
      card.revenuePerSale *= 2;
    }
  },

  'system_integration': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].toolEffectBonus = 1;
  },

  // === COMMUNITY LEADER EFFECTS ===
  'viral_post': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
    
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      drawCard(player);
      drawCard(player);
    }
  },

  'content_creation': (G, playerID, card) => {
    // Revenue increases with each card played this turn
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (card.revenuePerSale) {
      card.revenuePerSale += cardsPlayed * 5000;
    }
  },

  'influencer_collab': (G, playerID) => {
    const player = G.players[playerID];
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    
    if (cardsPlayed >= 2) {
      player.revenue += 75000;
      drawCard(player);
      drawCard(player);
    }
  },

  'social_media_manager': () => {
    // Passive effect - when playing 2nd card each turn, gain 1 capital
  },

  'trending_product': () => {
    // Passive effect - gains inventory when other cards are played
  },

  'engagement_boost': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].extraActionPlays = (G.effectContext[playerID].extraActionPlays || 0) + 1;
  },

  'community_platform': (G, playerID, card) => {
    // Revenue scales with hand size
    const player = G.players[playerID];
    if (card.revenuePerSale) {
      card.revenuePerSale += player.hand.length * 3000;
    }
  },

  'hashtag_campaign': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].effectsDoubled = true;
  },

  'content_creator': () => {
    // Passive effect - if played 3+ cards each turn, gain $50k
  },

  'meme_magic': () => {
    // Special cost reduction handled in game logic
  },

  // === SERIAL FOUNDER EFFECTS ===
  'strategic_pivot': (G, playerID) => {
    const player = G.players[playerID];
    // For now, automatically choose based on situation
    // In full implementation, player would choose
    
    // Simple heuristic: if low on cards, draw; if low on capital, gain capital; otherwise refresh
    if (player.hand.length < 3) {
      drawCard(player);
      drawCard(player);
    } else if (player.capital < 3) {
      player.capital = Math.min(10, player.capital + 3);
    } else {
      // Refresh a product
      const product = player.board.Products.find(p => p.inventory !== undefined && p.inventory < 3);
      if (product && product.inventory !== undefined) {
        product.inventory = 3;
      }
    }
  },

  'advisory_board': (G, playerID) => {
    const player = G.players[playerID];
    
    // Count different card types in play
    const hasTools = player.board.Tools.length > 0;
    const hasProducts = player.board.Products.length > 0;
    const hasEmployees = player.board.Employees.length > 0;
    
    let cardsToDraw = 0;
    if (hasTools) cardsToDraw++;
    if (hasProducts) cardsToDraw++;
    if (hasEmployees) cardsToDraw++;
    
    for (let i = 0; i < cardsToDraw; i++) {
      drawCard(player);
    }
  },

  'growth_hacking': () => {
    // Passive effect - choose different bonus each turn
  },

  'market_expansion': (G, playerID, card) => {
    // Revenue increases with number of Products controlled
    const player = G.players[playerID];
    const productCount = player.board.Products.length;
    if (card.revenuePerSale) {
      card.revenuePerSale += productCount * 5000;
    }
  },

  'experience_leverage': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].nextCardDiscount = 2;
  },

  'business_development': () => {
    // Passive effect - choose different bonus each turn
  },

  'diversified_revenue': (G, playerID, card) => {
    // Revenue based on variety of cards in play
    const player = G.players[playerID];
    const hasTools = player.board.Tools.length > 0 ? 1 : 0;
    const hasProducts = player.board.Products.length > 0 ? 1 : 0;
    const hasEmployees = player.board.Employees.length > 0 ? 1 : 0;
    
    const variety = hasTools + hasProducts + hasEmployees;
    if (card.revenuePerSale) {
      card.revenuePerSale += variety * 10000;
    }
  },

  'venture_network': () => {
    // Passive effect - draw card when playing Products
  },

  'exit_strategy': (G, playerID) => {
    const player = G.players[playerID];
    // In full implementation, player would choose
    const product = player.board.Products.find(p => p.inventory && p.inventory > 0);
    if (product && product.inventory && product.revenuePerSale) {
      const quantity = product.inventory;
      const doubleRevenue = product.revenuePerSale * 2;
      const totalRevenue = quantity * doubleRevenue;
      
      product.inventory = 0;
      player.revenue += totalRevenue;
    }
  },

  // === SHARED PRODUCT SALE EFFECTS ===
  
  // Generic sale effect function for products that draw cards when sold
  'sale_with_draw': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  // Products that draw a card when sold
  'custom_dog_portrait_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'minimalist_planner_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'ai_logo_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'sticker_pack_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'digital_wedding_invite_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'freelancing_ebook_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'digital_art_print_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  'handwritten_greeting_cards_sale': (G, playerID) => {
    const player = G.players[playerID];
    drawCard(player);
  },

  // Special sale effects
  'black_friday_sale': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].nextProductBonus = 2000;
  },

  'desk_clock_sale': (G, playerID) => {
    if (!G.effectContext) G.effectContext = {};
    if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
    G.effectContext[playerID].nextCardDiscount = 1;
  },

  // Simple sale effects (revenue already handled by revenuePerSale)
  'holiday_mug_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'soy_candle_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'sweater_bundle_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'yoga_course_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'name_necklace_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'pet_box_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'self_care_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'tshirt_drop_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'coffee_sampler_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'enamel_pin_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'eco_tote_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'phone_case_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'planner_stickers_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'pop_hoodie_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'water_bottle_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'makeup_brush_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'subscription_trial_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'budget_tracker_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'dinosaur_tee_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'bath_bomb_sale': () => {
    // Revenue already handled by revenuePerSale property
  },

  'greeting_cards_sale': () => {
    // Revenue already handled by revenuePerSale property
  },
}; 