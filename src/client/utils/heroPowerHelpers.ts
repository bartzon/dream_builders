import type { ClientCard } from '../types/game'

/**
 * Check if a hero power's requirements are met based on board state
 */
export function heroPowerRequirementsMet(
  heroId: string,
  products: ClientCard[]
): boolean {
  switch (heroId) {
    case 'brand_builder':
      // Brand Builder's Engage requires at least one product to boost
      return products.some(p => p.isActive !== false)
    
    case 'serial_founder':
      // Serial Founder's Double Down gives a choice, but one option needs products
      // Allow using the power if there are products OR if they can still draw cards
      // Actually, let's allow it always since one option (draw 2) doesn't need products
      return true
    
    default:
      // Other hero powers don't have specific board requirements
      // - Solo Hustler: Draw card (always available)
      // - Community Leader: Gain capital/revenue (always available)  
      // - Automation Architect: Gain capital per tool (works with 0 tools)
      return true
  }
} 