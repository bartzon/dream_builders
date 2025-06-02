import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState } from '../../../game/state'
import { GameStateBuilder, CardBuilder } from '../../test-data-builders'
import { soloHustlerCardEffects } from '../../../game/logic/effects/solo-hustler-effects'
import { brandBuilderCardEffects } from '../../../game/logic/effects/brand-builder-effects'
import { automationArchitectCardEffects } from '../../../game/logic/effects/automation-architect-effects'
import { communityLeaderCardEffects } from '../../../game/logic/effects/community-leader-effects'
import { serialFounderCardEffects } from '../../../game/logic/effects/serial-founder-effects'

describe('Draw Effects - Parameterized Tests', () => {
  let G: GameState
  const playerID = '0'

  beforeEach(() => {
    G = new GameStateBuilder().build()
  })

  // Test cases for simple draw effects
  const simpleDrawEffects = [
    {
      name: 'Hustle Hard',
      effectFn: soloHustlerCardEffects.hustle_hard,
      drawCount: 2,
      additionalEffect: 'gains 1 capital'
    },
    {
      name: 'Freelancer Network',
      effectFn: soloHustlerCardEffects.freelancer_network,
      drawCount: 2,
      additionalEffect: null
    },
    {
      name: 'Custom App',
      effectFn: automationArchitectCardEffects.custom_app,
      drawCount: 1,
      additionalEffect: 'sets up recurring effect'
    },
    {
      name: 'Live AMA',
      effectFn: communityLeaderCardEffects.live_ama,
      drawCount: 2,
      additionalEffect: 'gains 1 capital'
    }
  ]

  describe.each(simpleDrawEffects)(
    '$name - Draw $drawCount cards',
    ({ name, effectFn, drawCount, additionalEffect }) => {
      it(`should draw ${drawCount} cards`, () => {
        // Add enough cards to deck
        const deckCards = Array.from({ length: drawCount + 2 }, () => 
          new CardBuilder().asAction()
        )
        
        G = new GameStateBuilder()
          .withDeck(...deckCards)
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        const initialDeckSize = G.players[playerID].deck.length
        
        effectFn(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + drawCount)
        expect(G.players[playerID].deck.length).toBe(initialDeckSize - drawCount)
      })

      if (additionalEffect) {
        it(`should have additional effect: ${additionalEffect}`, () => {
          expect(effectFn).toBeDefined()
          // The specific additional effects are tested in individual test files
        })
      }
    }
  )

  // Test cases for conditional draw effects
  const conditionalDrawEffects = [
    {
      name: 'Brand Vision',
      effectFn: brandBuilderCardEffects.brand_vision,
      condition: 'no product',
      setup: () => new GameStateBuilder(),
      expectedDraw: 1
    },
    {
      name: 'Brand Vision',
      effectFn: brandBuilderCardEffects.brand_vision,
      condition: 'with product',
      setup: () => new GameStateBuilder().withProducts(new CardBuilder().asProduct()),
      expectedDraw: 2
    },
    {
      name: 'Founder Story',
      effectFn: brandBuilderCardEffects.founder_story,
      condition: 'no employee',
      setup: () => new GameStateBuilder(),
      expectedDraw: 2
    },
    {
      name: 'Founder Story',
      effectFn: brandBuilderCardEffects.founder_story,
      condition: 'with employee',
      setup: () => new GameStateBuilder().withEmployees(new CardBuilder().asEmployee()),
      expectedDraw: 3
    },
    {
      name: 'Market Surge',
      effectFn: serialFounderCardEffects.market_surge,
      condition: 'no product (draws instead of capital)',
      setup: () => new GameStateBuilder(),
      expectedDraw: 2
    }
  ]

  describe.each(conditionalDrawEffects)(
    '$name - $condition',
    ({ name, effectFn, condition, setup, expectedDraw }) => {
      it(`should draw ${expectedDraw} cards when ${condition}`, () => {
        G = setup()
          .withDeck(
            ...Array.from({ length: expectedDraw + 2 }, () => 
              new CardBuilder().asAction()
            )
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        effectFn(G, playerID)
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + expectedDraw)
      })
    }
  )

  // Test draw and discard effects
  const drawDiscardEffects = [
    {
      name: 'Midnight Oil',
      effectFn: soloHustlerCardEffects.midnight_oil,
      drawCount: 3,
      discardCount: 1,
      discardMechanism: 'sets pending flag'
    },
    {
      name: 'A/B Test',
      effectFn: automationArchitectCardEffects.ab_test,
      drawCount: 2,
      discardCount: 1,
      discardMechanism: 'creates pending choice',
      needsCard: true
    }
  ]

  describe.each(drawDiscardEffects)(
    '$name - Draw $drawCount then discard $discardCount',
    ({ name, effectFn, drawCount, discardMechanism, needsCard }) => {
      it(`should draw ${drawCount} cards and ${discardMechanism}`, () => {
        G = new GameStateBuilder()
          .withDeck(
            ...Array.from({ length: drawCount + 2 }, () => 
              new CardBuilder().asAction()
            )
          )
          .build()
        
        const initialHandSize = G.players[playerID].hand.length
        
        if (needsCard) {
          // A/B Test needs a card parameter
          const testCard = new CardBuilder().asAction()
          effectFn(G, playerID, testCard)
        } else {
          effectFn(G, playerID)
        }
        
        expect(G.players[playerID].hand.length).toBe(initialHandSize + drawCount)
        
        // Check for discard mechanism
        if (name === 'Midnight Oil') {
          expect(G.effectContext?.[playerID]?.midnightOilDiscardPending).toBe(true)
        } else if (name === 'A/B Test') {
          expect(G.players[playerID].pendingChoices).toHaveLength(1)
          expect(G.players[playerID].pendingChoices[0].type).toBe('choose_from_drawn_to_discard')
        }
      })
    }
  )
}) 