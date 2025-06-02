import { describe, it, expect } from 'vitest'
import type { Card } from '../../../game/types'
import type { GameState } from '../../../game/state'
import { soloHustlerDeck } from '../../../game/data/heroes/solo-hustler'
import { brandBuilderDeck } from '../../../game/data/heroes/brand-builder'
import { automationArchitectDeck } from '../../../game/data/heroes/automation-architect'
import { communityLeaderDeck } from '../../../game/data/heroes/community-leader'
import { serialFounderDeck } from '../../../game/data/heroes/serial-founder'
import { soloHustlerCardEffects } from '../../../game/logic/effects/solo-hustler-effects'
import { brandBuilderCardEffects } from '../../../game/logic/effects/brand-builder-effects'
import { automationArchitectCardEffects } from '../../../game/logic/effects/automation-architect-effects'
import { communityLeaderCardEffects } from '../../../game/logic/effects/community-leader-effects'
import { serialFounderCardEffects } from '../../../game/logic/effects/serial-founder-effects'

// Type for card effect functions
type CardEffectFunction = (G: GameState, playerID: string, card?: Card) => void

describe('Passive and Recurring Effects - Parameterized Tests', () => {
  // Gather all recurring effects from all decks
  const recurringEffects: Array<{
    card: Card,
    effects: Record<string, CardEffectFunction>,
    hero: string
  }> = []

  // Helper to add cards with recurring keyword
  const addRecurringCards = (deck: Card[], effects: Record<string, CardEffectFunction>, heroName: string) => {
    deck.forEach(card => {
      if (card.keywords?.includes('Recurring')) {
        recurringEffects.push({ card, effects, hero: heroName })
      }
    })
  }

  addRecurringCards(soloHustlerDeck, soloHustlerCardEffects, 'Solo Hustler')
  addRecurringCards(brandBuilderDeck, brandBuilderCardEffects, 'Brand Builder')
  addRecurringCards(automationArchitectDeck, automationArchitectCardEffects, 'Automation Architect')
  addRecurringCards(communityLeaderDeck, communityLeaderCardEffects, 'Community Leader')
  addRecurringCards(serialFounderDeck, serialFounderCardEffects, 'Serial Founder')

  describe.each(recurringEffects)(
    '$hero - $card.name (Recurring Effect)',
    ({ card, effects }) => {
      it('should have Recurring keyword', () => {
        expect(card.keywords).toContain('Recurring')
      })

      it('should have an effect implementation', () => {
        expect(card.effect).toBeDefined()
        if (card.effect) {
          expect(effects[card.effect]).toBeDefined()
        }
      })

      it('should be a Tool or Employee type (typical for recurring effects)', () => {
        expect(['Tool', 'Employee']).toContain(card.type)
      })
    }
  )

  // Test specific passive effect patterns
  const capitalGainEffects = [
    {
      name: 'Email Automation',
      deck: automationArchitectDeck,
      effects: automationArchitectCardEffects,
      effectName: 'email_automation',
      description: 'Recurring: Gain 1 capital'
    },
    {
      name: 'Scale Systems', 
      deck: automationArchitectDeck,
      effects: automationArchitectCardEffects,
      effectName: 'scale_systems',
      description: 'Recurring: Gain 1 capital per Tool'
    },
    {
      name: 'Board of Directors',
      deck: serialFounderDeck,
      effects: serialFounderCardEffects,
      effectName: 'board_of_directors',
      description: 'Recurring: Gain 2 capital'
    },
    {
      name: 'Steady Fans',
      deck: communityLeaderDeck,
      effects: communityLeaderCardEffects,
      effectName: 'steady_fans',
      description: 'Recurring: Gain 1 capital if played cards last turn'
    }
  ]

  describe.each(capitalGainEffects)(
    'Capital Gain Effect - $name',
    ({ name, deck, effects, effectName }) => {
      it('should exist in deck', () => {
        const card = deck.find(c => c.effect === effectName)
        expect(card).toBeDefined()
        expect(card?.name).toBe(name)
      })

      it('should have effect implementation', () => {
        expect(effects[effectName]).toBeDefined()
      })

      it('should have Recurring keyword', () => {
        const card = deck.find(c => c.effect === effectName)
        expect(card?.keywords).toContain('Recurring')
      })
    }
  )
}) 