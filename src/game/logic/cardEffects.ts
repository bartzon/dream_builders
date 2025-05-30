import type { GameState, PlayerState } from '../state';
import type { Card } from '../types';
import { drawCard } from './utils';
import { initEffectContext } from './effectContext';

// ==========================================
// CORE HELPER FUNCTIONS
// ==========================================

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

// ==========================================
// INVENTORY MANAGEMENT HELPERS
// ==========================================

function findProductWithInventory(player: PlayerState): Card | undefined {
  return player.board.Products.find((p: Card) => p.inventory && p.inventory > 0);
}

function addInventoryToSpecificProduct(product: Card, amount: number): void {
  if (product.inventory !== undefined) {
    product.inventory += amount;
  }
}

function createProductChoice(player: PlayerState, effect: string, filter?: (p: Card) => boolean): void {
  const products = filter 
    ? player.board.Products.filter(p => p.isActive !== false && filter(p))
    : player.board.Products.filter(p => p.isActive !== false);
  
  if (products.length === 0) return;
  
  if (products.length === 1) {
    // Auto-resolve if only one choice
    handleSingleProductChoice(products[0], effect);
  } else {
    // Create pending choice for multiple options
    player.pendingChoice = {
      type: 'choose_card',
      effect,
      cards: products.map(p => ({ ...p })),
    };
  }
}

function handleSingleProductChoice(product: Card, effect: string): void {
  switch (effect) {
    case 'add_inventory_to_product':
      addInventoryToSpecificProduct(product, 2);
      break;
    case 'add_inventory_if_empty':
      if (product.inventory === 0) product.inventory = 3;
      break;
    case 'simple_inventory_boost':
    case 'draw_and_inventory':
      addInventoryToSpecificProduct(product, 1);
      break;
  }
}

// ==========================================
// SALES HELPERS
// ==========================================

function sellFirstAvailableProduct(G: GameState, playerID: string): boolean {
  const player = G.players[playerID];
  const product = findProductWithInventory(player);
  if (product) {
    sellProduct(G, playerID, product, 1);
    return true;
  }
  return false;
}

// ==========================================
// BONUS APPLICATION HELPERS
// ==========================================

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

// No-op function for passive effects handled elsewhere
const passiveEffect = () => {};

// ==========================================
// MAIN SELL PRODUCT FUNCTION
// ==========================================

export function sellProduct(G: GameState, playerID: string, product: Card, quantity: number = 1): number {
  if (!product.inventory || product.inventory < quantity) return 0;
  
  const player = G.players[playerID];
  const baseRevenue = (product.revenuePerSale || 0) * quantity;
  let totalRevenue = baseRevenue;
  
  // Apply any revenue modifiers
  const ctx = G.effectContext?.[playerID];
  if (ctx) {
    // Product-specific revenue boost (from Supplier Collab)
    if (ctx.productRevenueBoosts && ctx.productRevenueBoosts[product.id]) {
      totalRevenue += ctx.productRevenueBoosts[product.id];
      // Use up the boost
      delete ctx.productRevenueBoosts[product.id];
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
  
  // Mark that a product was sold this turn
  if (ctx) {
    ctx.soldProductThisTurn = true;
  }
  
  return totalRevenue;
}

// ==========================================
// CARD EFFECTS REGISTRY
// ==========================================

export const cardEffects: Record<string, (G: GameState, playerID: string, card: Card) => void> = {
  // ==========================================
  // SOLO HUSTLER EFFECTS
  // ==========================================
  
  'hustle_hard': (G, playerID) => {
    drawCards(G, playerID, 2);
    gainCapital(G, playerID, 1);
  },

  'bootstrap_capital': (G, playerID) => {
    gainCapital(G, playerID, 2);
  },

  'diy_assembly': passiveEffect, // Cost reduction handled in getCardDiscount

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

  'quick_learner': (G: GameState, playerID: string) => {
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

  'shoestring_budget': passiveEffect, // Cost reduction handled in getCardDiscount

  // ==========================================
  // BRAND BUILDER EFFECTS
  // ==========================================
  
  'brand_vision': (G, playerID) => {
    const player = G.players[playerID];
    const hasProduct = player.board.Products.length > 0;
    drawCards(G, playerID, hasProduct ? 2 : 1);
  },

  'influencer_collab': (G, playerID) => {
    // Would add Audience in full implementation
    gainCapital(G, playerID, 2);
  },

  'content_calendar': passiveEffect, // Recurring effect handled in processPassiveEffects

  'viral_post': (G, playerID) => {
    drawCards(G, playerID, 1);
    const cardsPlayed = G.effectContext?.[playerID]?.cardsPlayedThisTurn || 0;
    if (cardsPlayed >= 2) {
      drawCards(G, playerID, 2);
    }
  },

  'email_list': passiveEffect, // Recurring effect handled in processPassiveEffects

  'visual_identity': passiveEffect, // Cost reduction handled in getCardDiscount

  'founder_story': (G, playerID) => {
    const player = G.players[playerID];
    const hasEmployee = player.board.Employees.length > 0;
    drawCards(G, playerID, hasEmployee ? 3 : 2);
  },

  'social_proof': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCapitalGain', 1);
  },

  'ugc_explosion': (G, playerID) => {
    // Would double Audience if Product exists in full implementation
    const player = G.players[playerID];
    if (player.board.Products.length > 0) {
      drawCards(G, playerID, 2);
    }
  },

  'personal_branding': passiveEffect, // Audience gain handled elsewhere

  // ==========================================
  // AUTOMATION ARCHITECT EFFECTS
  // ==========================================
  
  'auto_fulfill': passiveEffect, // Recurring effect handled in processPassiveEffects

  'optimize_checkout': passiveEffect, // Revenue boost handled in sellProduct

  'analytics_dashboard': passiveEffect, // Deck manipulation handled in processPassiveEffects

  'email_automation': passiveEffect, // Recurring effect handled in processPassiveEffects

  'ab_test': (G, playerID) => {
    const player = G.players[playerID];
    drawCards(G, playerID, 2);
    if (player.hand.length > 0) {
      // Would trigger discard choice in full implementation
    }
  },

  'scale_systems': passiveEffect, // Effect doubling handled in processPassiveEffects

  'optimize_workflow': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 2);
  },

  'custom_app': passiveEffect, // Modal card handled specially

  'zap_everything': (G, playerID) => {
    const player = G.players[playerID];
    const gameLog = G.gameLog || [];

    gameLog.push(`Player ${playerID} plays Zap Everything!`);

    player.board.Tools.forEach(tool => {
      let triggered = false;
      switch (tool.effect) {
        case 'auto_fulfill':
          if (G.effectContext?.[playerID]?.soldProductLastTurn) {
            player.capital = Math.min(10, player.capital + 1);
            triggered = true;
          }
          break;
        case 'email_automation':
          player.capital = Math.min(10, player.capital + 1);
          triggered = true;
          break;
        case 'basic_script': // Assuming basic_script is another AA tool
          player.capital = Math.min(10, player.capital + 1);
          triggered = true;
          break;
        case 'ml_model': { // Assuming ml_model is another AA tool
          const toolCount = player.board.Tools.length;
          player.capital = Math.min(10, player.capital + toolCount);
          triggered = true;
          break;
        }
        // Add other simple recurring Tool effects here if they should be triggered
        // Example from Brand Builder (if it were a Tool with simple recurring)
        // case 'content_calendar': 
        //   // Audience mechanic not implemented yet
        //   // gameLog.push(`${tool.name} would add Audience.`);
        //   triggered = true; 
        //   break;
        // Example from Serial Founder
        case 'legacy_playbook':
          drawCard(player); // drawCard is from './utils'
          triggered = true;
          break;
        case 'board_of_directors':
          player.capital = Math.min(10, player.capital + 2);
          triggered = true;
          break;
        // Solo Hustler
        case 'shoestring_budget':
          // This normally applies to the *next card played*.
          // Triggering it via Zap Everything might be complex or have unintended side effects.
          // For now, let's say it doesn't get a direct bonus here, or a simplified one.
          // player.capital = Math.min(10, player.capital + 1); // Simplified: just give 1 capital
          // triggered = true;
          gameLog.push(`${tool.name} recurring effect noted (normally applies to next card play).`);
          break;
        // Effects that require choices or are complex end-of-turn are skipped for now
        // case 'analytics_dashboard':
        // case 'scale_systems':
        // case 'incubator_resources': 
        //   break;
      }
      if (triggered) {
        gameLog.push(`Zapped ${tool.name}: its recurring effect was triggered.`);
      }
    });
    G.gameLog = gameLog;
  },

  'technical_cofounder': passiveEffect, // Cost reduction handled in getCardDiscount

  // ==========================================
  // COMMUNITY LEADER EFFECTS
  // ==========================================
  
  'town_hall': (G, playerID) => {
    const player = G.players[playerID];
    const employeeCount = player.board.Employees.length;
    drawCards(G, playerID, employeeCount);
  },

  'mutual_aid': (G) => {
    // Each player gains 1 capital
    Object.keys(G.players).forEach(id => {
      gainCapital(G, id, 1);
    });
  },

  'hype_train': passiveEffect, // Team capital gain handled elsewhere

  'mentorship_circle': passiveEffect, // Team draw handled elsewhere

  'fanbase': passiveEffect, // Recurring effect handled in processPassiveEffects

  'shared_spotlight': (G, playerID) => {
    // Choose teammate to draw 2 - simplified for single player
    drawCards(G, playerID, 2);
  },

  'community_manager': passiveEffect, // Cost reduction handled in getCardDiscount

  'live_ama': (G, playerID) => {
    drawCards(G, playerID, 2);
    // Would add 2 Audience in full implementation
  },

  'merch_drop': passiveEffect, // Product with special cost reduction

  'grassroots_launch': (G, playerID) => {
    // Would add 5 Audience in full implementation
    sellFirstAvailableProduct(G, playerID);
  },

  // ==========================================
  // SERIAL FOUNDER EFFECTS
  // ==========================================
  
  'legacy_playbook': passiveEffect, // Extra draw handled in processPassiveEffects

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

  'spin_off': passiveEffect, // Product with cost reduction based on Products

  'high_profile_exit': (G, playerID) => {
    const player = G.players[playerID];
    let productCount = 0;
    
    // Sell all products and count them
    player.board.Products.forEach(product => {
      if (product.inventory && product.inventory > 0) {
        sellProduct(G, playerID, product, product.inventory);
        productCount++;
      }
    });
    
    // Gain 2 extra capital per product sold
    gainCapital(G, playerID, productCount * 2);
  },

  'tech_press_feature': (G, playerID) => {
    // Would add 3-5 Audience based on Product in full implementation
    const player = G.players[playerID];
    const hasProduct = player.board.Products.length > 0;
    drawCards(G, playerID, hasProduct ? 2 : 1);
  },

  'serial_operator': passiveEffect, // Cost reduction handled in getCardDiscount

  'investor_buzz': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.doubleCapitalGain = true;
  },

  'incubator_resources': passiveEffect, // Choice handled in processPassiveEffects

  'board_of_directors': passiveEffect, // Recurring effect handled in processPassiveEffects

  'black_friday_blitz': (G, playerID) => {
    sellFirstAvailableProduct(G, playerID);
    // Would check for 3rd product this turn for bonus
  },

  // ==========================================
  // HERO POWER EFFECTS
  // ==========================================
  
  'solo_hustler_grind': passiveEffect, // Handled in heroAbilities.ts
  'brand_builder_engage': passiveEffect, // Handled in heroAbilities.ts
  'automation_architect_deploy': passiveEffect, // Handled in heroAbilities.ts
  'community_leader_viral': passiveEffect, // Handled in heroAbilities.ts
  'serial_founder_double_down': passiveEffect, // Handled in heroAbilities.ts

  // ==========================================
  // PRODUCT SALE EFFECTS (SHARED PRODUCTS)
  // ==========================================
  
  // Simple card draw on sale
  'custom_dog_portrait_sale': (G, playerID) => drawCards(G, playerID, 1),
  'minimalist_planner_sale': (G, playerID) => drawCards(G, playerID, 1),
  'ai_logo_sale': (G, playerID) => drawCards(G, playerID, 1),
  'sticker_pack_sale': (G, playerID) => drawCards(G, playerID, 1),
  'digital_wedding_invite_sale': (G, playerID) => drawCards(G, playerID, 1),
  
  // Products with no special effects
  'holiday_mug_sale': passiveEffect,
  'soy_candle_sale': passiveEffect,
  'sweater_bundle_sale': passiveEffect,
  'yoga_course_sale': passiveEffect,
  'name_necklace_sale': passiveEffect,
  'pet_box_sale': passiveEffect,
  'self_care_sale': passiveEffect,
  'tshirt_drop_sale': passiveEffect,
  'coffee_sampler_sale': passiveEffect,
  'wedding_invite_sale': passiveEffect,
  'enamel_pin_sale': passiveEffect,
  'eco_tote_sale': passiveEffect,
  'freelancing_ebook_sale': passiveEffect,
  'phone_case_sale': passiveEffect,
  'art_print_sale': passiveEffect,
  'planner_stickers_sale': passiveEffect,
  'pop_hoodie_sale': passiveEffect,
  'water_bottle_sale': passiveEffect,
  'makeup_brush_sale': passiveEffect,
  'subscription_trial_sale': passiveEffect,
  'budget_tracker_sale': passiveEffect,
  'dinosaur_tee_sale': passiveEffect,
  'bath_bomb_sale': passiveEffect,
  'greeting_cards_sale': passiveEffect,

  // Products with special effects
  'black_friday_sale': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextProductBonus', 2000);
  },

  'desk_clock_sale': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 1);
  },

  // ==========================================
  // INVENTORY SUPPORT EFFECTS
  // ==========================================
  
  'add_inventory_to_product': (G, playerID) => {
    const player = G.players[playerID];
    createProductChoice(player, 'add_inventory_to_product');
  },
  
  'add_inventory_if_empty': (G, playerID) => {
    const player = G.players[playerID];
    createProductChoice(player, 'add_inventory_if_empty', p => p.inventory === 0);
  },
  
  'add_inventory_to_low_stock': (G, playerID) => {
    const player = G.players[playerID];
    player.board.Products.forEach(product => {
      if (product.inventory !== undefined && product.inventory < 2 && product.isActive !== false) {
        product.inventory += 1;
      }
    });
  },
  
  'multi_product_inventory_boost': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter(p => p.isActive !== false);
    
    if (products.length === 0) return;
    
    // Initialize the selection counter
    const ctx = ensureEffectContext(G, playerID);
    ctx.warehouseExpansionCount = 0;
    
    // Always create a choice, allowing player to select up to 3 products
    player.pendingChoice = {
      type: 'choose_card',
      effect: 'multi_product_inventory_boost',
      cards: products.map(p => ({ ...p })),
    };
  },
  
  'inventory_and_sale_boost': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter(p => 
      p.isActive !== false && p.inventory !== undefined
    );
    
    if (products.length === 0) return;
    
    if (products.length === 1) {
      const product = products[0];
      addInventoryToSpecificProduct(product, 1);
      if (product.inventory && product.inventory > 0) {
        sellProduct(G, playerID, product, 1);
      }
    } else {
      player.pendingChoice = {
        type: 'choose_card',
        effect: 'inventory_and_sale_boost',
        cards: products.map(p => ({ ...p })),
      };
    }
  },
  
  'inventory_boost_plus_revenue': (G, playerID) => {
    const player = G.players[playerID];
    const products = player.board.Products.filter(p => p.isActive !== false);
    
    if (products.length === 0) return;
    
    const ctx = ensureEffectContext(G, playerID);
    
    if (products.length === 1) {
      const product = products[0];
      addInventoryToSpecificProduct(product, 2);
      if (!ctx.productRevenueBoosts) {
        ctx.productRevenueBoosts = {};
      }
      ctx.productRevenueBoosts[product.id] = 1000;
    } else {
      player.pendingChoice = {
        type: 'choose_card',
        effect: 'inventory_boost_plus_revenue',
        cards: products.map(p => ({ ...p })),
      };
    }
  },
  
  'delayed_inventory_boost': (G, playerID) => {
    const ctx = ensureEffectContext(G, playerID);
    ctx.delayedInventoryBoostTurns = 2;
  },
  
  'draw_and_inventory': (G, playerID) => {
    drawCards(G, playerID, 1);
    const player = G.players[playerID];
    createProductChoice(player, 'draw_and_inventory');
  },
  
  'simple_inventory_boost': (G, playerID) => {
    const player = G.players[playerID];
    createProductChoice(player, 'simple_inventory_boost');
  },
};

// ==========================================
// SPECIAL EFFECT HANDLERS
// ==========================================

export function resolveFastPivotEffect(G: GameState, playerID: string, productToDestroyId: string) {
  const player = G.players[playerID];
  const productIndexInBoard = player.board.Products.findIndex(p => p.id === productToDestroyId);

  if (productIndexInBoard !== -1) {
    player.board.Products.splice(productIndexInBoard, 1); // Destroy product
    drawCards(G, playerID, 2); // Draw 2 cards
    applyTemporaryBonus(G, playerID, 'nextProductDiscount', 2); // Next Product costs 2 less
  } else {
    console.warn(`Fast Pivot: Product with ID ${productToDestroyId} not found on board for player ${playerID}.`);
  }
} 