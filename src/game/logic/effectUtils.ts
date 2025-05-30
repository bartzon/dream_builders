import type { GameState } from '../state'
import { gainCapital, gainRevenue, drawCards } from './utils/effect-helpers'

// Effect builder types
type EffectFunction = (G: GameState, playerID: string) => void

// Common effect builders
export const effectBuilders = {
  // Simple draw effect
  draw: (count: number): EffectFunction => 
    (G, playerID) => drawCards(G, playerID, count),
  
  // Simple capital gain effect
  capital: (amount: number): EffectFunction => 
    (G, playerID) => gainCapital(G, playerID, amount),
  
  // Simple revenue gain effect
  revenue: (amount: number): EffectFunction => 
    (G, playerID) => gainRevenue(G, playerID, amount),
  
  // Combined draw and capital effect
  drawAndCapital: (drawCount: number, capitalAmount: number): EffectFunction =>
    (G, playerID) => {
      drawCards(G, playerID, drawCount)
      gainCapital(G, playerID, capitalAmount)
    },
  
  // Conditional draw based on board state
  drawIfHas: (
    boardZone: 'Products' | 'Tools' | 'Employees',
    drawIfTrue: number,
    drawIfFalse: number = 0
  ): EffectFunction =>
    (G, playerID) => {
      const player = G.players[playerID]
      const hasCards = player.board[boardZone].length > 0
      drawCards(G, playerID, hasCards ? drawIfTrue : drawIfFalse)
    },
  
  // Draw based on count of cards in zone
  drawPerCard: (boardZone: 'Products' | 'Tools' | 'Employees', multiplier: number = 1): EffectFunction =>
    (G, playerID) => {
      const player = G.players[playerID]
      const count = player.board[boardZone].length
      drawCards(G, playerID, count * multiplier)
    },
  
  // Combined effects
  combine: (...effects: EffectFunction[]): EffectFunction =>
    (G, playerID) => {
      effects.forEach(effect => effect(G, playerID))
    },
  
  // Conditional effect based on board state
  ifHas: (
    boardZone: 'Products' | 'Tools' | 'Employees',
    thenEffect: EffectFunction,
    elseEffect?: EffectFunction
  ): EffectFunction =>
    (G, playerID) => {
      const player = G.players[playerID]
      const hasCards = player.board[boardZone].length > 0
      if (hasCards) {
        thenEffect(G, playerID)
      } else if (elseEffect) {
        elseEffect(G, playerID)
      }
    },
  
  // Effect that checks multiple zones
  drawIfHasAll: (zones: Array<'Products' | 'Tools' | 'Employees'>): EffectFunction =>
    (G, playerID) => {
      const player = G.players[playerID]
      let cardsToDraw = 0
      zones.forEach(zone => {
        if (player.board[zone].length > 0) cardsToDraw++
      })
      drawCards(G, playerID, cardsToDraw)
    },
}

// Common passive effect placeholder
export const passiveEffect: EffectFunction = () => {
  // No-op function for passive effects handled elsewhere
} 