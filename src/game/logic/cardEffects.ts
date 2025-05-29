import type { GameState, PlayerState } from '../state';
import type { Card } from '../types';
import { drawCard } from './utils';
import { initEffectContext } from './effectContext';

// Helper Functions for Common Operations
function ensureEffectContext(G: GameState, playerID: string) {
  if (!G.effectContext) G.effectContext = {};
  if (!G.effectContext[playerID]) G.effectContext[playerID] = initEffectContext();
  return G.effectContext[playerID];
}

export function gainCapital(G: GameState, playerID: string, amount: number) {
  const player = G.players[playerID];
  player.capital = Math.min(10, player.capital + amount);
}

export function gainRevenue(G: GameState, playerID: string, amount: number) {
  const player = G.players[playerID];
  player.revenue += amount;
}

export function drawCards(G: GameState, playerID: string, count: number) {
  const player = G.players[playerID];
  for (let i = 0; i < count; i++) {
    drawCard(player);
  }
}

function findProductWithInventory(player: PlayerState): Card | undefined {
  return player.board.Products.find((p: Card) => p.inventory && p.inventory > 0);
}

// Additional Helper Functions for Common Patterns
function addInventoryToProduct(player: PlayerState, amount: number): boolean {
  const product = player.board.Products.find(p => p.inventory !== undefined);
  if (product && product.inventory !== undefined) {
    product.inventory += amount;
    return true;
  }
  return false;
}

function sellFirstAvailableProduct(G: GameState, playerID: string): boolean {
  const player = G.players[playerID];
  const product = findProductWithInventory(player);
  if (product) {
    sellProduct(G, playerID, product, 1);
    return true;
  }
  return false;
}

function sellAllInventoryFromProduct(G: GameState, playerID: string): boolean {
  const player = G.players[playerID];
  const product = findProductWithInventory(player);
  if (product && product.inventory) {
    const quantity = product.inventory;
    sellProduct(G, playerID, product, quantity);
    return true;
  }
  return false;
}

export function applyTemporaryBonus(G: GameState, playerID: string, bonusType: string, amount: number) {
  const ctx = ensureEffectContext(G, playerID);
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

function boostProductRevenue(card: Card, amount: number) {
  if (card.revenuePerSale) {
    card.revenuePerSale += amount;
  }
}

function doubleProductRevenue(card: Card) {
  if (card.revenuePerSale) {
    card.revenuePerSale *= 2;
  }
}

function checkActionPlayedThisTurn(G: GameState, playerID: string): boolean {
  const ctx = G.effectContext?.[playerID];
  return !!(ctx?.playedActionsThisTurn && ctx.playedActionsThisTurn > 0);
}

function addAppealToProduct(product: Card, amount: number) {
  if (product.appeal !== undefined) {
    product.appeal = (product.appeal || 0) + amount;
  } else {
    product.appeal = amount;
  }
}

// No-op function for passive effects handled elsewhere
const passiveEffect = () => {};

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
    const ctx = ensureEffectContext(G, playerID);
    ctx.flashSaleActive = true;
  },
  
  'popup_shop': passiveEffect,
  
  'sales_closer': passiveEffect,
  
  'social_media_ads': passiveEffect,
  
  'mega_launch_event': (G, playerID, card) => {
    if (checkActionPlayedThisTurn(G, playerID)) {
      boostProductRevenue(card, 50000);
    }
  },
  
  'limited_time_offer': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextProductBonus', 40000);
  },
  
  'viral_campaign': (G, playerID) => {
    drawCards(G, playerID, 2);
    
    // Check if sold a product last turn
    const ctx = G.effectContext?.[playerID];
    if (ctx?.soldProductLastTurn) {
      gainRevenue(G, playerID, 50000);
    }
  },
  
  'loyalty_program': passiveEffect,
  
  'influencer_partnership': passiveEffect,
  
  'popup_market_stall': passiveEffect,
  
  'email_blast': (G, playerID) => {
    sellFirstAvailableProduct(G, playerID);
  },
  
  'brand_ambassador': passiveEffect,
  
  'ad_budget_boost': passiveEffect,
  
  'seasonal_sale': (G, playerID) => {
    sellAllInventoryFromProduct(G, playerID);
  },
  
  'flash_mob_event': (G, playerID, card) => {
    if (checkActionPlayedThisTurn(G, playerID)) {
      doubleProductRevenue(card);
    }
  },
  
  // === DEVELOPER EFFECTS ===
  'automate_checkout': passiveEffect,
  
  'scaling_algorithm': passiveEffect,
  
  'bug_fix_sprint': (G, playerID) => {
    const player = G.players[playerID];
    addInventoryToProduct(player, 2);
  },
  
  'ai_optimization': (G, playerID) => {
    sellFirstAvailableProduct(G, playerID);
  },
  
  'saas_platform': passiveEffect,
  
  'code_refactor': (G, playerID) => {
    const player = G.players[playerID];
    addInventoryToProduct(player, 3);
  },
  
  'beta_tester_squad': passiveEffect,
  
  'load_balancer': passiveEffect,
  
  'cloud_infrastructure': passiveEffect,
  
  'debug_sprint': (G, playerID) => {
    const player = G.players[playerID];
    addInventoryToProduct(player, 2);
  },
  
  'ai_salesbot': passiveEffect,
  
  'continuous_deployment': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'extraActionPlays', 1);
  },
  
  'security_patch': passiveEffect,
  
  'open_source_sdk': passiveEffect,
  
  'tech_conference': (G, playerID, card) => {
    if (checkActionPlayedThisTurn(G, playerID)) {
      boostProductRevenue(card, 40000);
    }
  },
  
  // === OPERATOR EFFECTS ===
  'fulfillment_center': (G, playerID, card) => {
    // Check if 2+ items sold this turn
    const ctx = G.effectContext?.[playerID];
    if (ctx?.itemsSoldThisTurn && ctx.itemsSoldThisTurn >= 2) {
      boostProductRevenue(card, 30000);
    }
  },
  
  'logistics_specialist': passiveEffect,
  
  'express_shipping': (G, playerID) => {
    sellFirstAvailableProduct(G, playerID);
  },
  
  'global_supply_network': passiveEffect,
  
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
  
  'warehouse_manager': passiveEffect,
  
  'delivery_drone_fleet': passiveEffect,
  
  'stock_replenishment': (G, playerID) => {
    const player = G.players[playerID];
    addInventoryToProduct(player, 4);
  },
  
  'quality_control': (G, playerID) => {
    sellFirstAvailableProduct(G, playerID);
  },
  
  'supply_chain_expansion': passiveEffect,
  
  'customer_support_team': passiveEffect,
  
  'packaging_upgrade': passiveEffect,
  
  'express_returns': (G, playerID) => {
    const player = G.players[playerID];
    addInventoryToProduct(player, 2);
  },
  
  'inventory_forecast': passiveEffect,
  
  'regional_warehouse': passiveEffect,
  
  // === VISIONARY EFFECTS ===
  'disruptive_pivot': (G, playerID) => {
    // Double all revenue gained from sales this turn
    const ctx = ensureEffectContext(G, playerID);
    ctx.doubleRevenueThisTurn = true;
  },
  
  'moonshot_rd': passiveEffect,
  
  'investor_network': passiveEffect,
  
  'series_a_funding': (G, playerID) => {
    gainRevenue(G, playerID, 200000);
  },
  
  'visionary_conference': passiveEffect,
  
  'futuristic_prototype': (G, playerID, card) => {
    if (checkActionPlayedThisTurn(G, playerID)) {
      doubleProductRevenue(card);
    }
  },
  
  'innovation_lab': passiveEffect,
  
  'venture_capitalist': passiveEffect,
  
  'market_disruptor': (G, playerID) => {
    const player = G.players[playerID];
    const product = findProductWithInventory(player);
    if (product && product.inventory) {
      const quantity = product.inventory;
      product.inventory = 0;
      const revenue = 50000 * quantity;
      gainRevenue(G, playerID, revenue);
    }
  },
  
  'strategic_partnership': passiveEffect,
  
  'patent_portfolio': passiveEffect,
  
  'tech_incubator': passiveEffect,
  
  'accelerator_program': (G, playerID) => {
    drawCards(G, playerID, 2);
    gainCapital(G, playerID, 1);
  },
  
  'thought_leadership': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextActionRevenue', 30000);
  },
  
  'global_launch_event': passiveEffect,

  // === SOLO HUSTLER EFFECTS ===
  'hustle_hard': (G, playerID) => {
    drawCards(G, playerID, 2);
    gainCapital(G, playerID, 1);
  },

  'bootstrap_capital': (G, playerID) => {
    gainCapital(G, playerID, 2);
  },

  'diy_assembly': passiveEffect,

  'fast_pivot': (G, playerID) => {
    const player = G.players[playerID];
    const productsOnBoard = player.board.Products;

    if (productsOnBoard && productsOnBoard.length > 0) {
      const ctx = ensureEffectContext(G, playerID);
      ctx.fastPivotProductDestroyPending = true;
    }
  },

  'freelancer_network': (G, playerID) => {
    drawCards(G, playerID, 2);
  },

  'resourceful_solutions': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 2);
  },

  'scrappy_marketing': (G, playerID) => {
    const player = G.players[playerID];
    const hasProduct = player.board.Products.length > 0;
    if (hasProduct) {
      drawCards(G, playerID, 2);
    }
  },

  'midnight_oil': (G, playerID) => {
    drawCards(G, playerID, 3);
    const ctx = ensureEffectContext(G, playerID);
    ctx.midnightOilDiscardPending = true;
  },

  // === BRAND BUILDER EFFECTS ===
  'brand_story': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.globalAppealBoost = 1;
  },

  'community_manager': passiveEffect,

  'design_workshop': passiveEffect,

  'storytelling_campaign': (G, playerID) => {
    const player = G.players[playerID];
    const product = player.board.Products[0];
    if (product) {
      addAppealToProduct(product, 2);
    }
  },

  'brand_ambassador_new': passiveEffect,

  'quality_materials': passiveEffect,

  'brand_recognition': (G, playerID) => {
    const player = G.players[playerID];
    let totalAppeal = 0;
    player.board.Products.forEach(product => {
      totalAppeal += product.appeal || 0;
    });
    drawCards(G, playerID, totalAppeal);
  },

  // === AUTOMATION ARCHITECT EFFECTS ===
  'basic_script': passiveEffect,

  'automated_pipeline': passiveEffect,

  'code_deployment': (G, playerID) => {
    const player = G.players[playerID];
    const toolInHand = player.hand.find(card => card.type === 'Tool');
    if (toolInHand) {
      const toolIndex = player.hand.indexOf(toolInHand);
      player.hand.splice(toolIndex, 1);
      player.board.Tools.push(toolInHand);
      
      if (toolInHand.effect && cardEffects[toolInHand.effect]) {
        cardEffects[toolInHand.effect](G, playerID, toolInHand);
      }
    }
  },

  'process_optimization': passiveEffect,

  'ml_model': passiveEffect,

  'scheduled_task': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.recurringCapitalNextTurn = (ctx.recurringCapitalNextTurn || 0) + 1;
  },

  'system_integration': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.toolEffectBonus = 1;
  },

  // === COMMUNITY LEADER EFFECTS ===
  'viral_post': (G, playerID) => {
    drawCards(G, playerID, 1);
    
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      drawCards(G, playerID, 2);
    }
  },

  'influencer_collab': (G, playerID) => {
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      gainRevenue(G, playerID, 75000);
      drawCards(G, playerID, 2);
    }
  },

  'social_media_manager': passiveEffect,

  'trending_product': passiveEffect,

  'engagement_boost': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'extraActionPlays', 1);
  },

  'community_platform': (G, playerID, card) => {
    // Revenue scales with hand size
    const player = G.players[playerID];
    if (card.revenuePerSale) {
      boostProductRevenue(card, player.hand.length * 3000);
    }
  },

  'hashtag_campaign': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.effectsDoubled = true;
  },

  'content_creator': passiveEffect,

  'meme_magic': passiveEffect,

  // === SERIAL FOUNDER EFFECTS ===
  'strategic_pivot': (G, playerID) => {
    const player = G.players[playerID];
    // Simple heuristic: if low on cards, draw; if low on capital, gain capital; otherwise refresh
    if (player.hand.length < 3) {
      drawCards(G, playerID, 2);
    } else if (player.capital < 3) {
      gainCapital(G, playerID, 3);
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
    const hasTools = player.board.Tools.length > 0;
    const hasProducts = player.board.Products.length > 0;
    const hasEmployees = player.board.Employees.length > 0;
    
    let cardsToDraw = 0;
    if (hasTools) cardsToDraw++;
    if (hasProducts) cardsToDraw++;
    if (hasEmployees) cardsToDraw++;
    
    drawCards(G, playerID, cardsToDraw);
  },

  'growth_hacking': passiveEffect,

  'market_expansion': (G, playerID, card) => {
    // Revenue increases with number of Products controlled
    const player = G.players[playerID];
    const productCount = player.board.Products.length;
    boostProductRevenue(card, productCount * 5000);
  },

  'experience_leverage': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 2);
  },

  'business_development': passiveEffect,

  'diversified_revenue': (G, playerID, card) => {
    // Revenue based on variety of cards in play
    const player = G.players[playerID];
    const hasTools = player.board.Tools.length > 0 ? 1 : 0;
    const hasProducts = player.board.Products.length > 0 ? 1 : 0;
    const hasEmployees = player.board.Employees.length > 0 ? 1 : 0;
    
    const variety = hasTools + hasProducts + hasEmployees;
    boostProductRevenue(card, variety * 10000);
  },

  'venture_network': passiveEffect,

  'exit_strategy': (G, playerID) => {
    const player = G.players[playerID];
    const product = findProductWithInventory(player);
    if (product && product.inventory && product.revenuePerSale) {
      const quantity = product.inventory;
      const doubleRevenue = product.revenuePerSale * 2;
      const totalRevenue = quantity * doubleRevenue;
      
      product.inventory = 0;
      gainRevenue(G, playerID, totalRevenue);
    }
  },

  // === SIMPLE CARD DRAW ON SALE EFFECTS ===
  'custom_dog_portrait_sale': (G, playerID) => drawCards(G, playerID, 1),
  'minimalist_planner_sale': (G, playerID) => drawCards(G, playerID, 1),
  'ai_logo_sale': (G, playerID) => drawCards(G, playerID, 1),
  'sticker_pack_sale': (G, playerID) => drawCards(G, playerID, 1),
  'digital_wedding_invite_sale': (G, playerID) => drawCards(G, playerID, 1),

  // === SIMPLE EFFECTS ===
  'black_friday_sale': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextProductBonus', 2000);
  },

  'desk_clock_sale': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 1);
  },

  quick_learner: (G: GameState, playerID: string) => {
    const lastActionEffect = G.effectContext?.[playerID]?.lastActionEffect;
    const lastActionCard = G.effectContext?.[playerID]?.lastActionCard;
    
    // Only copy if we have a valid Action effect to copy
    if (lastActionEffect && lastActionCard && 
        lastActionCard.type === 'Action' && 
        cardEffects[lastActionEffect]) {
      // Copy the last Action's effect
      cardEffects[lastActionEffect](G, playerID, lastActionCard);
    }
    // If no valid Action to copy, Quick Learner does nothing
  },

  shoestring_budget: passiveEffect, // Handled in getCardDiscount
};

export function resolveFastPivotEffect(G: GameState, playerID: string, productToDestroyId: string) {
  const player = G.players[playerID];
  const productIndexInBoard = player.board.Products.findIndex(p => p.id === productToDestroyId);

  if (productIndexInBoard !== -1) {
    player.board.Products.splice(productIndexInBoard, 1); // Destroy product
    drawCards(G, playerID, 2); // Draw 2 cards
    applyTemporaryBonus(G, playerID, 'nextProductDiscount', 2); // Next Product costs 2 less
  } else {
    // Handle case where product might have been removed by another effect in the interim
    // Or log an error/warning
    console.warn(`Fast Pivot: Product with ID ${productToDestroyId} not found on board for player ${playerID}.`);
  }
} 