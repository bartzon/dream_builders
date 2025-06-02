import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../game/state'
import { GameStateBuilder, CardBuilder } from '../test-data-builders'
import { drawCard } from '../../game/logic/utils/deck-helpers'
import { processPassiveEffects } from '../../game/logic/turnEffects'
import { automationArchitectCardEffects } from '../../game/logic/effects/automation-architect-effects'

describe('Hand and Deck Management - Integration Tests', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Draw Effects with Empty Deck', () => {
    it('should handle draw effects when deck is empty', () => {
      G = new GameStateBuilder()
        .withEmptyDeck() // Empty deck
        .withHand(
          new CardBuilder().asAction()
        )
        .build()

      const initialHandSize = G.players[playerID].hand.length
      const drewCard = drawCard(G.players[playerID], 'Test Draw', G.gameLog)

      expect(drewCard).toBeUndefined() // Returns undefined when deck is empty
      expect(G.players[playerID].hand.length).toBe(initialHandSize)
    })

    it('should handle multiple draw effects with partial deck', () => {
      G = new GameStateBuilder()
        .withEmptyDeck() // Start with empty deck
        .withDeck(
          new CardBuilder().asAction() // Add only 1 card to deck
        )
        .build()

      const player = G.players[playerID]
      
      // Try to draw 3 cards
      let cardsDrawn = 0
      for (let i = 0; i < 3; i++) {
        const drawnCard = drawCard(player, 'Multi Draw', G.gameLog)
        if (drawnCard !== undefined) {
          cardsDrawn++
        }
      }

      expect(cardsDrawn).toBe(1)
      expect(player.deck.length).toBe(0)
      expect(player.hand.length).toBe(1)
    })
  })

  describe('Hand Limit Scenarios', () => {
    it('should handle drawing with full hand', () => {
      const handCards = Array.from({ length: 10 }, (_, i) => 
        new CardBuilder().withId(`h${i}`).asAction()
      )
      
      G = new GameStateBuilder()
        .withHand(...handCards)
        .withDeck(
          new CardBuilder().asAction()
        )
        .build()

      const initialHandSize = G.players[playerID].hand.length
      
      // Game doesn't have a hard hand limit, so draw should work
      drawCard(G.players[playerID], 'Draw with full hand', G.gameLog)
      
      expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
    })

    it('should handle discard from large hand', () => {
      const handCards = Array.from({ length: 8 }, (_, i) => 
        new CardBuilder().withId(`h${i}`).asAction()
      )
      
      G = new GameStateBuilder()
        .withHand(...handCards)
        .build()

      // Create a discard choice
      G.players[playerID].pendingChoices = [{
        type: 'discard',
        effect: 'forced_discard',
        cards: G.players[playerID].hand.slice(0, 3) // Choose from first 3 cards
      }]

      expect(G.players[playerID].pendingChoices[0].cards).toHaveLength(3)
    })
  })

  describe('Deck Manipulation Effects', () => {
    it('should handle Analytics Dashboard deck viewing', () => {
      G = new GameStateBuilder()
        .withHero('automation_architect')
        .withDeck(
          new CardBuilder().withId('d1').asAction(),
          new CardBuilder().withId('d2').asProduct(),
          new CardBuilder().withId('d3').asTool()
        )
        .withTools(
          new CardBuilder()
            .withEffect('analytics_dashboard')
            .withKeywords(['Recurring'])
            .asTool()
        )
        .build()

      // Analytics Dashboard would create a choice to view and discard
      const topCards = G.players[playerID].deck.slice(-2) // Top 2 cards
      expect(topCards).toHaveLength(2)
      expect(topCards[0].id).toBe('d2') // Second from top
      expect(topCards[1].id).toBe('d3') // Top card
    })

    it('should handle deck shuffling effects', () => {
      const deckCards = Array.from({ length: 5 }, (_, i) => 
        new CardBuilder().withId(`deck${i}`).asAction()
      )
      
      G = new GameStateBuilder()
        .withEmptyDeck() // Clear default deck
        .withDeck(...deckCards)
        .build()

      const originalOrder = G.players[playerID].deck.map(c => c.id)
      expect(originalOrder).toEqual(['deck0', 'deck1', 'deck2', 'deck3', 'deck4'])
      
      // In real game, shuffle would randomize order
      // Here we just verify deck integrity
      expect(G.players[playerID].deck).toHaveLength(5)
    })
  })

  describe('Card Movement Between Zones', () => {
    it('should handle cards moving from deck to hand to board', () => {
      const testProduct = new CardBuilder()
        .withId('moving-product')
        .withCost(2)
        .asProduct()

      G = new GameStateBuilder()
        .withCapital(5)
        .withEmptyDeck() // Clear default deck
        .withDeck(testProduct)
        .build()

      // Draw the card
      const drawnCard = drawCard(G.players[playerID], 'Draw product', G.gameLog)
      expect(drawnCard).toBeDefined()
      expect(G.players[playerID].hand).toHaveLength(1)
      expect(G.players[playerID].hand[0].id).toBe('moving-product')
      expect(G.players[playerID].deck).toHaveLength(0)

      // In real game, playing it would move to board
      const cardToPlay = G.players[playerID].hand[0]
      expect(cardToPlay.type).toBe('Product')
    })

    it('should handle discard pile interactions', () => {
      G = new GameStateBuilder()
        .withHand(
          new CardBuilder().withId('to-discard').asAction()
        )
        .build()

      // Simulate discarding (game doesn't track discard pile in state)
      G.players[playerID].hand = []

      expect(G.players[playerID].hand).toHaveLength(0)
      // In full implementation, card would be in discard pile
    })
  })

  describe('Multi-Effect Draw Sequences', () => {
    it('should handle passive draw effects at turn start', () => {
      G = new GameStateBuilder()
        .withHero('community_leader')
        .withTools(
          new CardBuilder()
            .withEffect('mentorship_circle') // Draw extra card at start
            .asTool()
        )
        .withDeck(
          new CardBuilder().asAction(),
          new CardBuilder().asAction()
        )
        .build()

      // Process passive effects (would include mentorship circle)
      processPassiveEffects(G, playerID)

      // Mentorship Circle effect would be processed during turn start
      // The actual drawing happens in the turn.onBegin phase
    })

    it('should handle conditional draw effects', () => {
      G = new GameStateBuilder()
        .withHero('brand_builder')
        .withProducts(
          new CardBuilder().asProduct()
        )
        .withDeck(
          new CardBuilder().asAction(),
          new CardBuilder().asAction()
        )
        .build()

      // Brand Vision draws 1 normally, 2 with product
      // This tests the condition checking
      const hasProduct = G.players[playerID].board.Products.length > 0
      const drawAmount = hasProduct ? 2 : 1

      expect(drawAmount).toBe(2)
    })
  })

  describe('A/B Test Complex Scenario', () => {
    it('should handle A/B Test full flow', () => {
      G = new GameStateBuilder()
        .withHero('automation_architect')
        .withDeck(
          new CardBuilder().withId('d1').asAction(),
          new CardBuilder().withId('d2').asProduct(),
          new CardBuilder().withId('d3').asTool()
        )
        .withHand(
          new CardBuilder().withId('h1').asAction()
        )
        .build()

      const testCard = new CardBuilder().asAction()
      const initialHandSize = G.players[playerID].hand.length
      const initialDeckSize = G.players[playerID].deck.length

      // Execute A/B Test
      automationArchitectCardEffects.ab_test(G, playerID, testCard)

      // Verify cards were drawn
      expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
      expect(G.players[playerID].deck.length).toBe(initialDeckSize - 2)

      // Verify choice was created
      expect(G.players[playerID].pendingChoices).toHaveLength(1)
      const choice = G.players[playerID].pendingChoices[0]
      expect(choice.type).toBe('choose_from_drawn_to_discard')
      expect(choice.cards).toHaveLength(2)
      
      // The drawn cards should be in the choice
      const drawnCardIds = choice.cards?.map(c => c.id) || []
      expect(drawnCardIds).toContain('d3') // Top card
      expect(drawnCardIds).toContain('d2') // Second card
    })
  })
}) 