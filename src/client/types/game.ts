// Card interface used in client components
export interface ClientCard {
  id?: string
  name: string
  cost: number
  type: string
  keywords?: string[]
  text?: string
  effect?: string
  resilience?: number
  synergyCondition?: string
  inventory?: number
  revenuePerSale?: number
  isActive?: boolean
  overheadCost?: number
  appeal?: number
  flavor?: string
}

// Pending choice types
export interface PendingChoice {
  type: string
  effect: string
  cards?: ClientCard[]
  cardIndices?: number[]
}

// Tooltip state types
export interface TooltipState {
  visible: boolean
  card?: ClientCard
  x: number
  y: number
}

// Hero power tooltip state
export interface HeroPowerTooltipState {
  visible: boolean
  x: number
  y: number
}

// Game UI state extracted from GameState
export interface GameUIState {
  hand: ClientCard[]
  deck: ClientCard[]
  products: ClientCard[]
  tools: ClientCard[]
  employees: ClientCard[]
  capital: number
  revenue: number
  hero: string
  heroAbilityUsed: boolean
  pendingChoice?: PendingChoice
  turn: number
}

// Effect context UI state
export interface EffectContextUI {
  itemsSoldThisTurn: number
  soldProductThisTurn: boolean
  midnightOilDiscardPending: boolean
  fastPivotProductDestroyPending: boolean
  nextCardDiscount?: number
  productCostReduction?: number
  cardsPlayedThisTurn?: number
  lastActionEffect?: string
  lastActionCard?: ClientCard
  firstCardDiscountUsed?: boolean
  productRevenueBoosts?: Record<string, number>
  delayedInventoryBoostTurns?: number
  soloHustlerDiscountedCard?: string
} 