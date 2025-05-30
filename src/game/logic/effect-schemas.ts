import { z } from 'zod'

// Individual effect context properties
export const BaseEffectContextSchema = z.object({
  cardsPlayedThisTurn: z.number().default(0),
  soldProductThisTurn: z.boolean().default(false),
  itemsSoldThisTurn: z.number().default(0),
  lastActionEffect: z.string().optional(),
  lastActionCard: z.any().optional(), // Card type would be circular dependency
  
  // Discounts and modifiers
  nextCardDiscount: z.number().default(0),
  productCostReduction: z.number().default(0),
  
  // Pending effects
  midnightOilDiscardPending: z.boolean().default(false),
  fastPivotProductDestroyPending: z.boolean().default(false),
  nextProductDiscount: z.number().default(0),
  
  // Hero-specific
  recurringCapitalNext: z.number().default(0),
})

export type EffectContext = z.infer<typeof BaseEffectContextSchema>

// Function to create a new effect context
export function createEffectContext(): EffectContext {
  return BaseEffectContextSchema.parse({})
}

// Function to reset turn-specific properties
export function resetTurnEffects(context: EffectContext): EffectContext {
  return {
    ...context,
    cardsPlayedThisTurn: 0,
    soldProductThisTurn: false,
    itemsSoldThisTurn: 0,
    lastActionEffect: undefined,
    lastActionCard: undefined,
    nextCardDiscount: 0,
    productCostReduction: 0,
    midnightOilDiscardPending: false,
    fastPivotProductDestroyPending: false,
    nextProductDiscount: 0,
  }
} 