import type { ClientCard } from '../types/game'

// Effects that require a product on the board to be playable
const EFFECTS_REQUIRING_PRODUCTS = new Set([
  // Direct inventory effects
  'add_inventory_to_product',      // Bulk Order Deal: Choose a Product. Add +2 inventory.
  'simple_inventory_boost',        // Last-Minute Restock: Choose a Product. Add +1 inventory.
  'inventory_boost_plus_revenue',  // Supplier Collab: Choose a Product. Add +2 inventory. Its next sale earns +1000.
  'inventory_and_sale_boost',      // Viral Unboxing Video: Choose a Product. Add +1 inventory and +1 sale this turn.
  'draw_and_inventory',            // Inventory Forecast Tool: Draw 1. Then choose a Product to gain +1 inventory.
  'multi_product_inventory_boost', // Warehouse Expansion: Choose up to 3 Products. Add +1 inventory to each.
  'merch_drop',                    // Merch Drop: Choose a Product and add +2 to its inventory.
  
  // Alternate effect names used by some cards
  'factory_direct',
  'fulfillment_center',
  'warehouse_expansion',
  
  // Serial Founder double down effects
  'serial_founder_double_down',    // Double Down: Choice of draw 2 or add inventory
  'serial_founder_double_down_add_inventory', // The specific choice to add inventory
  
  // Brand Builder Engage card effect
  'brand_builder_engage',          // Engage: Card version that gives choice of draw 1 or add inventory
  'brand_builder_engage_add_inventory', // The specific choice to add inventory
  
  // Engagement effect
  'engage_inventory_boost',
  
  // Black Friday Blitz
  'black_friday_blitz',
])

// Effects that require a product with 0 inventory
const EFFECTS_REQUIRING_EMPTY_PRODUCTS = new Set([
  'add_inventory_if_empty', // Reorder Notification: Choose a Product with 0 inventory. Add +3 inventory.
])

// Effects that require an inactive product with inventory
const EFFECTS_REQUIRING_INACTIVE_PRODUCTS = new Set([
  'refresh_product', // Serial Founder's hero power
])

/**
 * Check if a card requires products on the board to be playable
 */
export function requiresProductsOnBoard(card: ClientCard): boolean {
  if (!card.effect) return false
  return EFFECTS_REQUIRING_PRODUCTS.has(card.effect) || 
         EFFECTS_REQUIRING_EMPTY_PRODUCTS.has(card.effect)
}

/**
 * Check if a card's playability requirements are met based on board state
 */
export function cardPlayabilityRequirementsMet(
  card: ClientCard, 
  products: ClientCard[]
): boolean {
  if (!card.effect) return true
  
  // Check effects that need any product
  if (EFFECTS_REQUIRING_PRODUCTS.has(card.effect)) {
    return products.some(p => p.isActive !== false)
  }
  
  // Check effects that need a product with 0 inventory
  if (EFFECTS_REQUIRING_EMPTY_PRODUCTS.has(card.effect)) {
    return products.some(p => p.isActive !== false && p.inventory === 0)
  }
  
  // Check effects that need an inactive product with inventory
  if (EFFECTS_REQUIRING_INACTIVE_PRODUCTS.has(card.effect)) {
    return products.some(p => p.isActive === false && p.inventory !== undefined && p.inventory > 0)
  }
  
  // Card doesn't have special requirements
  return true
} 