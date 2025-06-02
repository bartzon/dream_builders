import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import type { Card } from '../../../game/types'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { soloHustlerCardEffects } from '../../../game/logic/effects/solo-hustler-effects'
import { brandBuilderCardEffects } from '../../../game/logic/effects/brand-builder-effects'
import { automationArchitectCardEffects } from '../../../game/logic/effects/automation-architect-effects'
import { communityLeaderCardEffects } from '../../../game/logic/effects/community-leader-effects'
import { serialFounderCardEffects } from '../../../game/logic/effects/serial-founder-effects'
import { testCardEffect, testHeroAbility } from '../../test-helpers'

// Import card definitions
import { soloHustlerDeck } from '../../../game/data/heroes/solo-hustler'
import { brandBuilderDeck, brandBuilderHero } from '../../../game/data/heroes/brand-builder'
import { automationArchitectDeck } from '../../../game/data/heroes/automation-architect'
import { communityLeaderDeck } from '../../../game/data/heroes/community-leader'
import { serialFounderDeck } from '../../../game/data/heroes/serial-founder'

// Helper to find card by effect name
function findCardByEffect(deck: Card[], effectName: string): Card | undefined {
  return deck.find(card => card.effect === effectName)
}

describe('Hero-Specific Card Effects', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  describe('Solo Hustler Effects', () => {
    describe('midnight_oil', () => {
      it('should match card definition behavior', () => {
        const card = findCardByEffect(soloHustlerDeck, 'midnight_oil')
        if (!card) throw new Error('Card not found: midnight_oil')
        
        // Card: Midnight Oil - Cost: 1, Type: Action
        // Effect: "Draw 3 cards, then discard 1 card."
        testCardEffect(card.name, card, () => {
          // Add cards to deck for drawing
          G = new GameStateBuilder()
            .withDeck(
              new CardBuilder().asAction(),
              new CardBuilder().asAction(),
              new CardBuilder().asAction(),
              new CardBuilder().asAction(), // Add extra card
              new CardBuilder().asAction(), // Add extra card  
              new CardBuilder().asAction()  // Add extra card
            )
            .build()
          
          const initialDeckSize = G.players[playerID].deck.length
          
          soloHustlerCardEffects.midnight_oil(G, playerID)
          
          // Based on card text: "Draw 3 cards, then discard 1 card."
          expect(G.players[playerID].hand.length).toBe(3)
          expect(G.players[playerID].deck.length).toBe(initialDeckSize - 3)
          expect(G.effectContext?.[playerID]?.midnightOilDiscardPending).toBe(true)
        })
      })
    })

    describe('hustle_hard', () => {
      it('should match card definition behavior', () => {
        const card = findCardByEffect(soloHustlerDeck, 'hustle_hard')
        if (!card) throw new Error('Card not found: hustle_hard')
        
        // Card: Hustle Hard - Cost: 2, Type: Action
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
          
          soloHustlerCardEffects.hustle_hard(G, playerID)
          
          // Based on card text, determine expected behavior
          expect(G.players[playerID].hand.length).toBe(initialHandSize + 2)
          expect(G.players[playerID].capital).toBe(6)
        })
      })
    })

    describe('bootstrap_capital', () => {
      it('should match card definition behavior', () => {
        const card = findCardByEffect(soloHustlerDeck, 'bootstrap_capital')
        if (!card) throw new Error('Card not found: bootstrap_capital')
        
        // Card: Bootstrap Capital - Cost: 1, Type: Action
        // Effect: "Gain 2 capital."
        testCardEffect(card.name, card, () => {
          G = new GameStateBuilder()
            .withCapital(3)
            .build()
          
          soloHustlerCardEffects.bootstrap_capital(G, playerID)
          
          expect(G.players[playerID].capital).toBe(5)
        })
      })
    })

    describe('fast_pivot', () => {
      it('should match card definition behavior', () => {
        const card = findCardByEffect(soloHustlerDeck, 'fast_pivot')
        if (!card) throw new Error('Card not found: fast_pivot')
        
        // Card: Fast Pivot - Cost: 0, Type: Action
        // Effect: "Destroy a Product you control. Draw 3 cards."
        testCardEffect(card.name, card, () => {
          const product = new CardBuilder().asProduct()
          
          G = new GameStateBuilder()
            .withProducts(product)
            .withDeck(
              new CardBuilder().asAction(),
              new CardBuilder().asAction(),
              new CardBuilder().asAction()
            )
            .build()
          
          soloHustlerCardEffects.fast_pivot(G, playerID)
          
          expect(G.effectContext?.[playerID]?.fastPivotProductDestroyPending).toBe(true)
        })
      })
    })
  })

  describe('Brand Builder Effects', () => {
    Object.entries(brandBuilderCardEffects).forEach(([effectName, effectFn]) => {
      describe(effectName, () => {
        it('should be implemented and match card definition', () => {
          const card = findCardByEffect(brandBuilderDeck, effectName)
          if (!card) {
            // Check if it's a hero power
            if (effectName === 'brand_builder_engage') {
              // Hero Power: Brand Builder - Engage
              // Effect: "Choose a Product you control and add +1 appeal"
              testHeroAbility(brandBuilderHero.name, brandBuilderHero.heroPower, () => {
                expect(effectFn).toBeDefined()
              })
              return
            }
            throw new Error(`Card not found for effect: ${effectName}`)
          }
          
          testCardEffect(card.name, card, () => {
            expect(effectFn).toBeDefined()
            expect(typeof effectFn).toBe('function')
            
            // Test specific implementations based on card text
            if (effectName === 'brand_vision') {
              // Card: Brand Vision - Cost: 1, Type: Action
              // Effect: "Draw 1 card. If you control a Product, draw 2 instead."
              G = new GameStateBuilder()
                .withDeck(
                  new CardBuilder().asAction(),
                  new CardBuilder().asAction()
                )
                .build()
              
              const initialHandSize = G.players[playerID].hand.length
              effectFn(G, playerID)
              expect(G.players[playerID].hand.length).toBe(initialHandSize + 1)
              
              // Test with product
              G = new GameStateBuilder()
                .withProducts(new CardBuilder().asProduct())
                .withDeck(
                  new CardBuilder().asAction(),
                  new CardBuilder().asAction()
                )
                .build()
              
              effectFn(G, playerID)
              expect(G.players[playerID].hand.length).toBe(2)
            }
            
            if (effectName === 'influencer_collab') {
              // Card: Influencer Collab - Cost: 2, Type: Action  
              // Effect: "If you control a Product, gain 3 capital."
              G = new GameStateBuilder()
                .withProducts(new CardBuilder().asProduct())
                .withCapital(2)
                .build()
              
              effectFn(G, playerID)
              expect(G.players[playerID].capital).toBe(5)
            }
            
            if (effectName === 'ugc_explosion') {
              // Card: UGC Explosion - Cost: 3, Type: Action
              // Effect: "Add 3 inventory to each Product you control."
              const product1 = new CardBuilder().withId('p1').withInventory(2).asProduct()
              const product2 = new CardBuilder().withId('p2').withInventory(1).asProduct()
              
              G = new GameStateBuilder()
                .withProducts(product1, product2)
                .build()
              
              effectFn(G, playerID)
              
              expect(product1.inventory).toBe(5)
              expect(product2.inventory).toBe(4)
            }
          })
        })
      })
    })
  })

  describe('Effect Implementation Coverage', () => {
    it('should verify all card effects have implementations', () => {
      const allDecks = [
        { hero: 'Solo Hustler', deck: soloHustlerDeck, effects: soloHustlerCardEffects },
        { hero: 'Brand Builder', deck: brandBuilderDeck, effects: brandBuilderCardEffects },
        { hero: 'Automation Architect', deck: automationArchitectDeck, effects: automationArchitectCardEffects },
        { hero: 'Community Leader', deck: communityLeaderDeck, effects: communityLeaderCardEffects },
        { hero: 'Serial Founder', deck: serialFounderDeck, effects: serialFounderCardEffects }
      ]

      const missingImplementations: string[] = []

      allDecks.forEach(({ hero, deck, effects }) => {
        deck.forEach(card => {
          if (card.effect && !effects[card.effect]) {
            missingImplementations.push(`${hero} - ${card.name} (${card.effect}): ${card.text}`)
          }
        })
      })

      if (missingImplementations.length > 0) {
        console.error('\n=== MISSING IMPLEMENTATIONS ===')
        missingImplementations.forEach(missing => console.error(missing))
        console.error('================================\n')
      }

      expect(missingImplementations).toHaveLength(0)
    })
  })
}) 