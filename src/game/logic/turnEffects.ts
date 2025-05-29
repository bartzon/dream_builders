import type { GameState } from '../state';
import type { Card } from '../types';
import { drawCard } from './utils';
import { sellProduct } from './cardEffects';

// Process passive effects at start of turn
export function processPassiveEffects(G: GameState, playerID: string) {
  const player = G.players[playerID];
  
  // === LEGACY EFFECTS ===
  
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
  
  // === NEW HERO EFFECTS ===
  
  // Solo Hustler Effects
  // DIY Assembly - reduce Product costs
  const diyAssembly = player.board.Tools.find(t => t.effect === 'diy_assembly');
  if (diyAssembly && G.effectContext?.[playerID]) {
    G.effectContext[playerID].productCostReduction = 1;
  }
  
  // Automation Architect Effects
  // Basic Script - gain 1 capital each turn
  const basicScript = player.board.Tools.find(t => t.effect === 'basic_script');
  if (basicScript) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Machine Learning Model - gain capital equal to number of Tools
  const mlModel = player.board.Tools.find(t => t.effect === 'ml_model');
  if (mlModel) {
    const toolCount = player.board.Tools.length;
    player.capital = Math.min(10, player.capital + toolCount);
  }
  
  // Server Farm - generates passive income
  const serverFarm = player.board.Products.find(p => p.effect === 'server_farm');
  if (serverFarm) {
    player.revenue += 10000;
  }
  
  // Brand Builder Effects
  // Community Manager - Products with Appeal generate bonus revenue
  const communityManager = player.board.Employees.find(e => e.effect === 'community_manager');
  if (communityManager) {
    player.board.Products.forEach(product => {
      if (product.appeal && product.appeal > 0) {
        const bonus = product.appeal * 5000;
        player.revenue += bonus;
      }
    });
  }
  
  // Serial Founder Effects
  // Growth Hacking - choose bonus each turn
  const growthHacking = player.board.Tools.find(t => t.effect === 'growth_hacking');
  if (growthHacking) {
    // Simple rotation: capital, cards, revenue
    const turn = G.turn % 3;
    if (turn === 0) {
      player.capital = Math.min(10, player.capital + 1);
    } else if (turn === 1) {
      drawCard(player);
    } else {
      player.revenue += 20000;
    }
  }
  
  // Business Development - choose different bonus each turn
  const businessDev = player.board.Employees.find(e => e.effect === 'business_development');
  if (businessDev) {
    // Similar rotation
    const turn = G.turn % 3;
    if (turn === 1) {
      player.capital = Math.min(10, player.capital + 1);
    } else if (turn === 2) {
      drawCard(player);
    } else {
      player.revenue += 25000;
    }
  }
  
  // Community Leader Effects
  // Content Creator - if played 3+ cards last turn, gain $50k
  const contentCreator = player.board.Employees.find(e => e.effect === 'content_creator');
  if (contentCreator && G.effectContext?.[playerID]) {
    // This would need to track from previous turn in a full implementation
    // For now, just check if they have many cards in hand (active player)
    if (player.hand.length >= 5) {
      player.revenue += 50000;
    }
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

// Process automatic sales at start of turn - NEW MECHANIC
export function processAutomaticSales(G: GameState, playerID: string) {
  const player = G.players[playerID];
  let productsSold = 0;
  
  // === NEW AUTOMATIC SELLING MECHANIC ===
  // Sell 1 item from each Product with inventory > 0
  player.board.Products.forEach(product => {
    if (product.inventory && product.inventory > 0 && product.isActive !== false) {
      sellProduct(G, playerID, product, 1);
      productsSold++;
    }
  });
  
  // Track that products were sold this turn if any were sold
  if (productsSold > 0 && G.effectContext?.[playerID]) {
    G.effectContext[playerID].soldProductThisTurn = true;
    G.effectContext[playerID].itemsSoldThisTurn = 
      (G.effectContext[playerID].itemsSoldThisTurn || 0) + productsSold;
  }
  
  // === LEGACY CARD EFFECTS (additional automatic sales) ===
  
  // Pop-up Shop effect - sell 1 additional item
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
  
  // AI Salesbot effect - automatically sell 1 additional item
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
  
  // Automated Pipeline effect - sell 1 additional item from each Product
  const automatedPipeline = player.board.Tools.find(t => t.effect === 'automated_pipeline');
  if (automatedPipeline) {
    player.board.Products.forEach(product => {
      if (product.inventory && product.inventory > 0 && product.isActive) {
        sellProduct(G, playerID, product, 1);
      }
    });
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
  
  // === LEGACY EFFECTS ===
  
  // Brand Ambassador effect - Actions cost 1 less
  if (card.type === 'Action') {
    const brandAmbassador = player.board.Employees.find(e => e.effect === 'brand_ambassador');
    if (brandAmbassador) discount += 1;
    
    const customerSupport = player.board.Employees.find(e => e.effect === 'customer_support_team');
    if (customerSupport) discount += 1;
  }
  
  // === NEW HERO EFFECTS ===
  
  // Solo Hustler - Product cost reduction
  if (card.type === 'Product') {
    const productReduction = G.effectContext?.[playerID]?.productCostReduction || 0;
    discount += productReduction;
    
    // DIY Assembly effect - Products cost 1 less
    const diyAssembly = player.board.Tools.find(t => t.effect === 'diy_assembly');
    if (diyAssembly) discount += 1;
  }
  
  // Community Leader - Meme Magic cost reduction
  if (card.effect === 'meme_magic') {
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      discount = card.cost; // Make it cost 0
    }
  }
  
  // Brand Builder - Quality Materials effect (increases cost but handled in card effects)
  if (card.type === 'Product') {
    const qualityMaterials = player.board.Tools.find(t => t.effect === 'quality_materials');
    if (qualityMaterials) {
      discount -= 1; // Actually increases cost
    }
  }
  
  return Math.min(discount, card.cost); // Can't reduce below 0
}

// Handle card play effects
export function handleCardPlayEffects(G: GameState, playerID: string, card: Card) {
  const player = G.players[playerID];
  const ctx = G.effectContext?.[playerID];
  
  // Track card types played
  if (ctx) {
    // Increment cards played counter
    ctx.cardsPlayedThisTurn = (ctx.cardsPlayedThisTurn || 0) + 1;
    
    if (card.type === 'Action') {
      ctx.playedActionThisTurn = true;
      ctx.playedActionsThisTurn = (ctx.playedActionsThisTurn || 0) + 1;
      
      // Visionary Conference effect - gain money when playing actions
      const visionaryConf = player.board.Tools.find(t => t.effect === 'visionary_conference');
      if (visionaryConf) {
        player.revenue += 25000;
      }
      
      // Innovation Lab effect - draw when playing actions
      const innovationLab = player.board.Tools.find(t => t.effect === 'innovation_lab');
      if (innovationLab) {
        drawCard(player);
      }
      
      // Thought Leadership effect - add revenue to action
      if (ctx.nextActionRevenue && ctx.nextActionRevenue > 0) {
        player.revenue += ctx.nextActionRevenue;
        ctx.nextActionRevenue = 0;
      }
    }
    
    if (card.type === 'Tool') {
      ctx.playedToolThisTurn = true;
    }
    
    if (card.type === 'Product') {
      ctx.firstProductPlayed = true;
      
      // Apply Appeal bonuses for Brand Builder mechanics
      if (card.appeal !== undefined) {
        // Global Appeal boost
        if (ctx.globalAppealBoost) {
          card.appeal += ctx.globalAppealBoost;
        }
        
        // Design Workshop effect - new Products enter with +1 Appeal
        const designWorkshop = player.board.Tools.find(t => t.effect === 'design_workshop');
        if (designWorkshop) {
          card.appeal += 1;
        }
      } else if (ctx.globalAppealBoost || player.board.Tools.some(t => t.effect === 'design_workshop')) {
        // Initialize Appeal if not present but effects apply
        card.appeal = 0;
        if (ctx.globalAppealBoost) {
          card.appeal += ctx.globalAppealBoost;
        }
        const designWorkshop = player.board.Tools.find(t => t.effect === 'design_workshop');
        if (designWorkshop) {
          card.appeal += 1;
        }
      }
      
      // Venture Network effect - draw card when playing Products
      const ventureNetwork = player.board.Tools.find(t => t.effect === 'venture_network');
      if (ventureNetwork) {
        drawCard(player);
      }
    }
    
    // Social Media Manager effect - gain capital on 2nd card
    if (ctx.cardsPlayedThisTurn === 2) {
      const socialMediaManager = player.board.Employees.find(e => e.effect === 'social_media_manager');
      if (socialMediaManager) {
        player.capital = Math.min(10, player.capital + 1);
      }
    }
    
    // Trending Product effect - gains inventory when other cards are played
    const trendingProducts = player.board.Products.filter(p => p.effect === 'trending_product');
    trendingProducts.forEach(product => {
      if (product.inventory !== undefined) {
        product.inventory += 1;
      }
    });
  }
} 