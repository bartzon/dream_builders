import { describe, it, expect } from 'vitest'
import { GameStateBuilder, CardBuilder, TestScenarios } from '../../test-data-builders'
import { processAutomaticSales } from '../../../game/logic/turnEffects'
import { gainCapital } from '../../../game/logic/utils/effect-helpers'
import { communityLeaderCardEffects } from '../../../game/logic/effects/community-leader-effects'
import { automationArchitectCardEffects } from '../../../game/logic/effects/automation-architect-effects'

describe('Test Data Builders Demonstration', () => {
  const playerID = '0'

  describe('GameStateBuilder', () => {
    it('should create a simple game state with products', () => {
      const G = new GameStateBuilder()
        .withProducts(
          new CardBuilder().withId('p1').withInventory(3).asProduct(),
          new CardBuilder().withId('p2').withInventory(2).asProduct()
        )
        .build()

      expect(G.players[playerID].board.Products).toHaveLength(2)
      expect(G.players[playerID].board.Products[0].inventory).toBe(3)
    })

    it('should create a complex board state fluently', () => {
      const G = new GameStateBuilder()
        .withCapital(7)
        .withRevenue(5000)
        .withHero('community_leader')
        .withTools(
          new CardBuilder().withName('Email Automation').asTool(),
          new CardBuilder().withName('Analytics Dashboard').asTool()
        )
        .withProducts(
          new CardBuilder().withName('Online Course').asProduct()
        )
        .withEmployees(
          new CardBuilder().withName('Community Manager').asEmployee()
        )
        .withEffectContext({
          cardsPlayedThisTurn: 2,
          soldProductLastTurn: true
        })
        .build()

      const player = G.players[playerID]
      expect(player.capital).toBe(7)
      expect(player.revenue).toBe(5000)
      expect(player.hero).toBe('community_leader')
      expect(player.board.Tools).toHaveLength(2)
      expect(player.board.Products).toHaveLength(1)
      expect(player.board.Employees).toHaveLength(1)
      expect(G.effectContext?.[playerID]?.cardsPlayedThisTurn).toBe(2)
    })

    it('should handle empty states', () => {
      const G = new GameStateBuilder()
        .withEmptyBoard()
        .withEmptyHand()
        .withEmptyDeck()
        .build()

      const player = G.players[playerID]
      expect(player.board.Tools).toHaveLength(0)
      expect(player.board.Products).toHaveLength(0)
      expect(player.board.Employees).toHaveLength(0)
      expect(player.hand).toHaveLength(0)
      expect(player.deck).toHaveLength(0)
    })

    it('should create states for testing specific mechanics', () => {
      // Test capital cap
      const G = new GameStateBuilder()
        .withCapital(8)
        .build()

      gainCapital(G, playerID, 5)
      expect(G.players[playerID].capital).toBe(10) // Capped at 10

      // Test product sales - products sell 1 inventory per turn
      const G2 = new GameStateBuilder()
        .withProducts(
          new CardBuilder()
            .withInventory(2)
            .withRevenuePerSale(1500)
            .asProduct()
        )
        .build()

      processAutomaticSales(G2, playerID)
      expect(G2.players[playerID].revenue).toBe(1500) // 1 inventory sold
      expect(G2.players[playerID].board.Products[0].inventory).toBe(1) // 1 inventory left
    })
  })

  describe('CardBuilder', () => {
    it('should create cards with custom properties', () => {
      const product = new CardBuilder()
        .withId('custom-product')
        .withName('Premium Widget')
        .withCost(5)
        .withInventory(10)
        .withRevenuePerSale(2000)
        .withEffect('premium_sales')
        .asProduct()

      expect(product.id).toBe('custom-product')
      expect(product.name).toBe('Premium Widget')
      expect(product.cost).toBe(5)
      expect(product.inventory).toBe(10)
      expect(product.revenuePerSale).toBe(2000)
      expect(product.effect).toBe('premium_sales')
    })

    it('should use defaults when not specified', () => {
      const tool = new CardBuilder().asTool()
      
      expect(tool.id).toBe('t1')
      expect(tool.name).toBe('Test Tool')
      expect(tool.cost).toBe(2)
      expect(tool.type).toBe('Tool')
    })

    it('should override defaults with spread operator', () => {
      const employee = new CardBuilder()
        .withName('Senior Developer')
        .asEmployee({ cost: 5, effect: 'productivity_boost' })

      expect(employee.name).toBe('Senior Developer')
      expect(employee.cost).toBe(5)
      expect(employee.effect).toBe('productivity_boost')
    })

    it('should validate required fields for generic build', () => {
      expect(() => {
        new CardBuilder().build()
      }).toThrow('Card builder missing required properties')

      const validCard = new CardBuilder()
        .withId('valid')
        .withName('Valid Card')
        .withCost(1)
        .withType('Action')
        .withText('Does something')
        .build()

      expect(validCard.id).toBe('valid')
    })
  })

  describe('TestScenarios', () => {
    it('should create product-heavy scenarios', () => {
      const G = TestScenarios.withProductsReadyToSell(3)
      
      expect(G.players[playerID].board.Products).toHaveLength(3)
      G.players[playerID].board.Products.forEach(product => {
        expect(product.inventory).toBe(2)
        expect(product.revenuePerSale).toBe(1000)
      })
    })

    it('should create a full board scenario', () => {
      const G = TestScenarios.withFullBoard()
      const board = G.players[playerID].board

      expect(board.Tools).toHaveLength(2)
      expect(board.Products).toHaveLength(2)
      expect(board.Employees).toHaveLength(1)
    })

    it('should create capital limit scenario', () => {
      const G = TestScenarios.atCapitalLimit()
      
      expect(G.players[playerID].capital).toBe(10)
      
      // Test that gaining more capital doesn't exceed limit
      gainCapital(G, playerID, 5)
      expect(G.players[playerID].capital).toBe(10)
    })

    it('should create hero-specific scenarios', () => {
      const G = TestScenarios.withHeroSetup('automation_architect', {
        tools: 3,
        products: 1,
        capital: 7
      })

      const player = G.players[playerID]
      expect(player.hero).toBe('automation_architect')
      expect(player.board.Tools).toHaveLength(3)
      expect(player.board.Products).toHaveLength(1)
      expect(player.capital).toBe(7)

      // Test Automation Architect specific effect
      automationArchitectCardEffects.zap_everything(G, playerID)
      expect(player.capital).toBe(10) // 7 + 3 (2 base + 1 for 3+ tools)
    })
  })

  describe('Real Test Examples Using Builders', () => {
    it('should test Community Leader town hall effect', () => {
      const G = new GameStateBuilder()
        .withHero('community_leader')
        .withEmployees(
          new CardBuilder().withId('e1').asEmployee(),
          new CardBuilder().withId('e2').asEmployee(),
          new CardBuilder().withId('e3').asEmployee()
        )
        .withDeck(
          new CardBuilder().asAction(),
          new CardBuilder().asAction(),
          new CardBuilder().asAction()
        )
        .build()

      const initialHandSize = G.players[playerID].hand.length
      communityLeaderCardEffects.town_hall(G, playerID)
      
      // Should draw 1 card per employee
      expect(G.players[playerID].hand.length).toBe(initialHandSize + 3)
    })

    it('should test complex board interaction', () => {
      const G = new GameStateBuilder()
        .withBoard({
          tools: [
            new CardBuilder().withEffect('visual_identity').asTool(),
            new CardBuilder().withEffect('email_automation').asTool()
          ],
          products: [
            new CardBuilder()
              .withCost(3)
              .withInventory(5)
              .asProduct()
          ]
        })
        .withEffectContext({
          cardsPlayedThisTurn: 2,
          comboActive: true
        })
        .build()

      // Visual Identity should reduce product costs by 1 when another tool exists
      // This would be tested in the actual game logic
      expect(G.players[playerID].board.Tools).toHaveLength(2)
      expect(G.effectContext?.[playerID]?.comboActive).toBe(true)
    })
  })
}) 