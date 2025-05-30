import { useCallback } from 'react'
import type { ClientCard, EffectContextUI } from '../types/game'

export function useCardDiscount(
  effectContext: EffectContextUI,
  tools: ClientCard[],
  employees: ClientCard[]
) {
  const getCardDiscount = useCallback((card: ClientCard) => {
    let discount = 0
    
    // Check for next card discount
    if (effectContext.nextCardDiscount) {
      discount += effectContext.nextCardDiscount || 0
    }
    
    // Brand Ambassador effect - Actions cost 1 less
    if (card.type === 'Action') {
      const brandAmbassador = employees.find(e => e.effect === 'brand_ambassador')
      if (brandAmbassador) discount += 1
      
      const customerSupport = employees.find(e => e.effect === 'customer_support_team')
      if (customerSupport) discount += 1
    }
    
    // Solo Hustler - Product cost reduction
    if (card.type === 'Product') {
      // Check if this specific card was drawn by Solo Hustler hero power
      if (card.id && effectContext.soloHustlerDiscountedCard === card.id) {
        discount += 1
      }
      
      // DIY Assembly effect - Products cost 1 less
      const diyAssembly = tools.find(t => t.effect === 'diy_assembly')
      if (diyAssembly) discount += 1
    }
    
    // Community Leader - Meme Magic cost reduction
    if (card.effect === 'meme_magic') {
      const cardsPlayed = effectContext.cardsPlayedThisTurn || 0
      if (cardsPlayed >= 2) {
        discount = card.cost // Make it cost 0
      }
    }
    
    // Brand Builder - Quality Materials effect (increases cost)
    if (card.type === 'Product') {
      const qualityMaterials = tools.find(t => t.effect === 'quality_materials')
      if (qualityMaterials) {
        discount -= 1 // Actually increases cost
      }
    }
    
    // Solo Hustler - Shoestring Budget effect (first card each turn costs 1 less)
    const shoestringBudget = tools.find(t => t.effect === 'shoestring_budget')
    if (shoestringBudget && !effectContext.firstCardDiscountUsed) {
      discount += 1
    }
    
    // Can't reduce below 0 or be negative discount
    return Math.min(Math.max(0, discount), card.cost)
  }, [effectContext, tools, employees])
  
  const getCostInfo = useCallback((card: ClientCard) => {
    const discount = getCardDiscount(card)
    return {
      originalCost: card.cost,
      discount,
      finalCost: Math.max(0, card.cost - discount)
    }
  }, [getCardDiscount])
  
  return {
    getCardDiscount,
    getCostInfo
  }
} 