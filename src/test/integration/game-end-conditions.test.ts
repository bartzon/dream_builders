import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../game/state'
import { GameStateBuilder, CardBuilder } from '../test-data-builders'
import { checkGameEnd } from '../../game/logic/utils/game-state-helpers'
import { processAutomaticSales } from '../../game/logic/turnEffects'

describe('Game End Conditions - Integration Tests', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Win Condition Interactions', () => {
    it('should handle revenue generation pushing player to win', () => {
      G = new GameStateBuilder()
        .withRevenue(497000) // Just below win threshold (500k)
        .withProducts(
          new CardBuilder()
            .withInventory(2)
            .withRevenuePerSale(3000)
            .asProduct()
        )
        .build()

      expect(G.gameOver).toBe(false)

      // Process sales which should push over 500k
      // Automatic sales sell 1 item per product: 497k + 3k = 500k
      processAutomaticSales(G, playerID)

      expect(G.players[playerID].revenue).toBe(500000)
      
      checkGameEnd(G)
      expect(G.gameOver).toBe(true)
      expect(G.winner).toBe(true)
    })

    it('should handle multiple revenue sources combining to win', () => {
      G = new GameStateBuilder()
        .withRevenue(495000)
        .withProducts(
          new CardBuilder()
            .withInventory(3)
            .withRevenuePerSale(2000)
            .asProduct(),
          new CardBuilder()
            .withInventory(2)
            .withRevenuePerSale(3000)
            .asProduct()
        )
        .build()

      processAutomaticSales(G, playerID)

      // Automatic sales: 1 from each product
      // 495k + (1 * 2k) + (1 * 3k) = 495k + 2k + 3k = 500k
      expect(G.players[playerID].revenue).toBe(500000)
      
      checkGameEnd(G)
      expect(G.gameOver).toBe(true)
      expect(G.winner).toBe(true)
    })
  })

  describe('Loss Condition Interactions', () => {
    it('should handle running out of cards with effects in play', () => {
      G = new GameStateBuilder()
        .withEmptyDeck() // Empty deck
        .withEmptyHand() // Empty hand
        .withTools(
          new CardBuilder()
            .withEffect('email_automation') // Would normally gain capital
            .asTool()
        )
        .build()

      checkGameEnd(G)
      
      // Even with passive effects, should lose if no cards and no products
      expect(G.gameOver).toBe(true)
      expect(G.winner).toBe(false)
    })

    it('should not lose if can still generate revenue without cards', () => {
      G = new GameStateBuilder()
        .withEmptyDeck() // Empty deck
        .withEmptyHand() // Empty hand
        .withProducts(
          new CardBuilder()
            .withInventory(5)
            .withRevenuePerSale(1000)
            .asProduct()
        )
        .withRevenue(250000)
        .build()

      checkGameEnd(G)
      
      // Has products that can sell, so game continues
      expect(G.gameOver).toBe(false)
    })
  })

  describe('Edge Cases at Game End', () => {
    it('should handle effects that trigger on game end', () => {
      G = new GameStateBuilder()
        .withRevenue(499000)
        .withProducts(
          new CardBuilder()
            .withInventory(2)
            .withRevenuePerSale(1000)
            .asProduct()
        )
        .withTools(
          new CardBuilder()
            .withEffect('optimize_checkout') // +250 per sale (if implemented)
            .asTool()
        )
        .build()

      processAutomaticSales(G, playerID)

      // Automatic sales: 1 item sold for 1000
      // With optimize_checkout bonus (if implemented): might add extra revenue
      // Should reach at least 500k
      expect(G.players[playerID].revenue).toBeGreaterThanOrEqual(500000)
      
      checkGameEnd(G)
      expect(G.gameOver).toBe(true)
    })

    it('should handle exactly reaching win threshold', () => {
      G = new GameStateBuilder()
        .withRevenue(499000)
        .withProducts(
          new CardBuilder()
            .withInventory(1)
            .withRevenuePerSale(1000)
            .asProduct()
        )
        .build()

      processAutomaticSales(G, playerID)

      expect(G.players[playerID].revenue).toBe(500000)
      
      checkGameEnd(G)
      expect(G.gameOver).toBe(true)
      expect(G.winner).toBe(true)
    })
  })
}) 