import type { GameState } from '../state';
import type { Card } from '../types';
import { sellProduct } from './utils/sales-helpers';
import { drawCard } from './utils/deck-helpers';

// Import individual passive effect handlers
import { handleFulfillmentAppIntegration } from './passive-effects/fulfillment-app-integration';
import { handleAutomationArchitectPassives } from './passive-effects/automation-architect-passives';
import { handleCommunityManager } from './passive-effects/community-manager-passive';
import { handleSerialFounderChoicePassives } from './passive-effects/serial-founder-passives';
import { handleContentCreator } from './passive-effects/content-creator-passive';
import { handleLegacyPassiveEffects } from './passive-effects/legacy-passive-effects';

// Import discount source handlers
import {
  getNextCardDiscount,
  getActionCardSynergyDiscount,
  getProductSynergyDiscount,
  getMemeMagicDiscount,
  getQualityMaterialsCostIncrease,
  getShoestringBudgetDiscount,
  getCommunityManagerDiscount
} from './effects/discount-sources';

// Process passive effects at start of turn
export function processPassiveEffects(G: GameState, playerID: string) {
  handleLegacyPassiveEffects(G, playerID);
  handleFulfillmentAppIntegration(G, playerID);
  handleAutomationArchitectPassives(G, playerID);
  handleCommunityManager(G, playerID);
  handleSerialFounderChoicePassives(G, playerID);
  handleContentCreator(G, playerID);

  // Note: DIY Assembly's productCostReduction was part of Solo Hustler logic.
  // It was correctly removed from here as it's handled by getCardDiscount mechanisms.
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

// Get cost reduction for a card type (actual application)
export function getCardDiscount(G: GameState, playerID: string, card: Card): number {
  const player = G.players[playerID];
  let totalDiscount = 0;

  totalDiscount += getNextCardDiscount(G, playerID, true); // true for applying/consuming
  totalDiscount += getActionCardSynergyDiscount(player, card);
  totalDiscount += getProductSynergyDiscount(G, playerID, player, card, true); // true for applying/consuming
  totalDiscount += getMemeMagicDiscount(G, playerID, card);
  totalDiscount += getQualityMaterialsCostIncrease(player, card); // This will be negative
  totalDiscount += getShoestringBudgetDiscount(G, playerID, player);
  totalDiscount += getCommunityManagerDiscount(player, card);
  
  return Math.min(Math.max(0, totalDiscount), card.cost); // Ensure discount isn't negative or more than card cost
}

// Get cost information for UI display (read-only, does not consume discounts)
export function getCardCostInfo(G: GameState, playerID: string, card: Card): { originalCost: number, discount: number, finalCost: number } {
  const player = G.players[playerID];
  let totalDiscount = 0;

  totalDiscount += getNextCardDiscount(G, playerID, false); // false for UI display only
  totalDiscount += getActionCardSynergyDiscount(player, card);
  totalDiscount += getProductSynergyDiscount(G, playerID, player, card, false); // false for UI display only
  totalDiscount += getMemeMagicDiscount(G, playerID, card);
  totalDiscount += getQualityMaterialsCostIncrease(player, card);
  totalDiscount += getShoestringBudgetDiscount(G, playerID, player);
  totalDiscount += getCommunityManagerDiscount(player, card);

  const effectiveDiscount = Math.min(Math.max(0, totalDiscount), card.cost);
  const finalCost = Math.max(0, card.cost - effectiveDiscount);
  
  return {
    originalCost: card.cost,
    discount: effectiveDiscount,
    finalCost
  };
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
      ctx.productCardsPlayedThisTurn = (ctx.productCardsPlayedThisTurn || 0) + 1;
      
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
        // Storing hand size before to identify the new card for potential highlight
        const handSizeBeforeVentureDraw = player.hand.length;
        drawCard(player);
        if (player.hand.length > handSizeBeforeVentureDraw && G.effectContext?.[playerID]) {
          const drawnCardFromVenture = player.hand[player.hand.length - 1];
          if (drawnCardFromVenture?.id) {
            if (!G.effectContext[playerID].recentlyAffectedCardIds) G.effectContext[playerID].recentlyAffectedCardIds = [];
            G.effectContext[playerID].recentlyAffectedCardIds?.push(drawnCardFromVenture.id);
            if(G.gameLog) G.gameLog.push(`Venture Network drew ${drawnCardFromVenture.name}.`);
          }
        }
      }

      // Advisory Board effect - draw card when playing Products
      const advisoryBoard = player.board.Tools.find(t => t.effect === 'advisory_board');
      if (advisoryBoard) {
        const handSizeBeforeAdvisoryDraw = player.hand.length;
        drawCard(player);
        if (player.hand.length > handSizeBeforeAdvisoryDraw && G.effectContext?.[playerID]) {
          const drawnCardFromAdvisory = player.hand[player.hand.length - 1];
          if (drawnCardFromAdvisory?.id) {
            // Ensure the array exists
            if (!G.effectContext[playerID].recentlyAffectedCardIds) {
              G.effectContext[playerID].recentlyAffectedCardIds = [];
            }
            G.effectContext[playerID].recentlyAffectedCardIds?.push(drawnCardFromAdvisory.id);
            if(G.gameLog) G.gameLog.push(`Advisory Board (due to ${card.name} play) drew ${drawnCardFromAdvisory.name}.`);
          }
        }
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