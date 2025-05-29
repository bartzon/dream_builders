export type CardType = "product" | "service" | "marketing" | "talent" | "investment"
export type Phase = "Action" | "Growth"

export interface Card {
  id: string
  name: string
  type: CardType
  cost: number
  value: number
  description: string
}

export interface Hero {
  id: string
  name: string
}

export interface HeroPower {
  name: string
  description: string
  value: number
}

export interface Teammate {
  id: string
  hero: Hero
  capital: number
  inventory: Card[]
  handSize: number
}

export interface GameLog {
  type: string
  message: string
  amount?: number
  timestamp: string
}

export interface GameState {
  currentPlayer: {
    hero: Hero
    heroPower: HeroPower
    heroPowerCooldown: number
    capital: number
    hand: Card[]
    inventory: Card[]
    deck: Card[]
    discard: Card[]
  }
  teammates: Teammate[]
  currentPhase: Phase
  gameLog: GameLog[]
} 