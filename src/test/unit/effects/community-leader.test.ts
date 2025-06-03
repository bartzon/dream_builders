import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { communityLeaderCardEffects } from '../../../game/logic/effects/community-leader-effects'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'
import { testCardEffect, testHeroAbility } from '../../test-helpers'

// Import card definitions
import { communityLeaderDeck, communityLeaderHero } from '../../../game/data/heroes/community-leader'

// Helper to find card by effect name
function findCardByEffect(effectName: string) {
  return communityLeaderDeck.find(card => card.effect === effectName)
}

describe('Community Leader Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Hero Power: Go Viral', () => {
    it('should check implementation exists', () => {
      // Hero Power: Go Viral
      // Effect: "If you played 2+ cards this turn, copy a Product you control."
      testHeroAbility(communityLeaderHero.name, communityLeaderHero.heroPower, () => {
        expect(heroAbilityEffects.community_leader_viral).toBeDefined()
        // Complex implementation with product copying
      })
    })

    it('should add a product to the deck with full inventory, not the current board inventory', () => {
      // Use a product from sharedProductPool with a known id and inventory
      const productId = 'enamel_pin_collection';
      const defaultInventory = 6; // from sharedProductPool
      const boardInventory = 2; // simulate a depleted product
      G = new GameStateBuilder()
        .withHero('community_leader')
        .withProducts(
          new CardBuilder().withId(productId).withInventory(boardInventory).asProduct()
        )
        .withEffectContext({ cardsPlayedThisTurn: 2 }) // Enable Go Viral
        .build();
      // const deckBefore = G.players[playerID].deck.length;
      heroAbilityEffects.community_leader_viral(G, playerID);
      const deckAfter = G.players[playerID].deck;
      // Find the newly added product in the deck
      const added = deckAfter.find(card => card.id === productId && card.inventory === defaultInventory);
      expect(added).toBeDefined();
    });
  })

  describe('town_hall', () => {
    it('should draw 1 card per Employee', () => {
      const card = findCardByEffect('town_hall')!
      // Card: Town Hall - Cost: 1, Type: Action
      // Effect: "Draw 1 card per Employee you control."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .withEmployees(
            new CardBuilder().asEmployee(),
            new CardBuilder().asEmployee()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        communityLeaderCardEffects.town_hall(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
      })
    })
  })

  describe('mutual_aid', () => {
    it('should gain 2 capital', () => {
      const card = findCardByEffect('mutual_aid')!
      // Card: Mutual Aid - Cost: 1, Type: Action
      // Effect: "Gain 2 capital."
      testCardEffect(card.name, card, () => {
        const initialCapital = G.players[playerID].capital
        
        communityLeaderCardEffects.mutual_aid(G, playerID)
        
        expect(G.players[playerID].capital).toBe(initialCapital + 2)
      })
    })
  })

  describe('hype_train', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('hype_train')!
      // Card: Hype Train - Cost: 2, Type: Tool
      // Effect: "Recurring: When you sell a Product, add +1 inventory to another Product."
      testCardEffect(card.name, card, () => {
        expect(communityLeaderCardEffects.hype_train).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('mentorship_circle', () => {
    it('should be a passive effect', () => {
      const card = findCardByEffect('mentorship_circle')!
      // Card: Mentorship Circle - Cost: 2, Type: Tool
      // Effect: "At the start of your turn, gain 1 capital per Employee you control."
      testCardEffect(card.name, card, () => {
        expect(communityLeaderCardEffects.mentorship_circle).toBeDefined()
        // Handled in turn.onBegin
      })
    })
  })

  describe('steady_fans', () => {
    it('should be a passive recurring effect', () => {
      const card = findCardByEffect('steady_fans')!
      // Card: Steady Fans - Cost: 1, Type: Tool
      // Effect: "Recurring: If you played a card last turn, gain 1 capital."
      testCardEffect(card.name, card, () => {
        expect(communityLeaderCardEffects.steady_fans).toBeDefined()
        expect(card.keywords).toContain('Recurring')
        // Handled in processPassiveEffects
      })
    })
  })

  describe('shared_spotlight', () => {
    it('should draw 2 cards and conditionally discount', () => {
      const card = findCardByEffect('shared_spotlight')!
      // Card: Shared Spotlight - Cost: 2, Type: Action
      // Effect: "Draw 2 cards. If you played 2+ cards this turn, your next card costs 1 less."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        // Test without playing 2+ cards
        communityLeaderCardEffects.shared_spotlight(G, playerID)
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
        expect(G.effectContext?.[playerID]?.nextCardDiscount).toBe(0)
        
        // Test after playing 2+ cards
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .withEffectContext({
            cardsPlayedThisTurn: 2
          })
          .build()
        
        communityLeaderCardEffects.shared_spotlight(G, playerID)
        expect(G.effectContext?.[playerID]?.nextCardDiscount).toBe(1)
      })
    })
  })

  describe('community_manager', () => {
    it('should be a passive effect for cost reduction', () => {
      const card = findCardByEffect('community_manager')!
      // Card: Community Manager - Cost: 3, Type: Employee
      // Effect: "The first card you play each turn costs 1 less."
      testCardEffect(card.name, card, () => {
        expect(communityLeaderCardEffects.community_manager).toBeDefined()
        // Handled in getCardDiscount
      })
    })
  })

  describe('live_ama', () => {
    it('should draw 2 cards and gain 1 capital', () => {
      const card = findCardByEffect('live_ama')!
      // Card: Live AMA - Cost: 2, Type: Action
      // Effect: "Draw 2 cards. Gain 1 capital."
      testCardEffect(card.name, card, () => {
        G = new GameStateBuilder()
          .withDeck(
            new CardBuilder().asAction(),
            new CardBuilder().asAction()
          )
          .withCapital(5)
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        const initialCapital = G.players[playerID].capital
        
        communityLeaderCardEffects.live_ama(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
        expect(G.players[playerID].capital).toBe(initialCapital + 1)
      })
    })
  })

  describe('merch_drop', () => {
    it('should create product choice for inventory boost', () => {
      const card = findCardByEffect('merch_drop')!
      // Card: Merch Drop - Cost: 2, Type: Action
      // Effect: "Choose a Product. Add +3 inventory. Your next Product costs 1 less this turn."
      testCardEffect(card.name, card, () => {
        const product = new CardBuilder().asProduct()
        G = new GameStateBuilder()
          .withProducts(product)
          .build()
        
        communityLeaderCardEffects.merch_drop(G, playerID)
        
        expect(G.players[playerID].pendingChoices).toHaveLength(1)
        expect(G.players[playerID].pendingChoices[0].effect).toBe('merch_drop_add_inventory')
      })
    })
  })

  describe('grassroots_launch', () => {
    it('should add +2 inventory to all Products', () => {
      const card = findCardByEffect('grassroots_launch')!
      // Card: Grassroots Launch - Cost: 3, Type: Action
      // Effect: "All your Products gain +2 inventory."
      testCardEffect(card.name, card, () => {
        const product1 = new CardBuilder().withId('p1').withInventory(1).asProduct()
        const product2 = new CardBuilder().withId('p2').withInventory(2).asProduct()
        
        G = new GameStateBuilder()
          .withProducts(product1, product2)
          .build()
        
        communityLeaderCardEffects.grassroots_launch(G, playerID)
        
        expect(product1.inventory).toBe(3)
        expect(product2.inventory).toBe(4)
      })
    })
  })
}) 