import { describe, it, expect } from 'vitest'

// Import all hero data
import { soloHustlerDeck, soloHustlerHero } from '../../../game/data/heroes/solo-hustler'
import { brandBuilderDeck, brandBuilderHero } from '../../../game/data/heroes/brand-builder'
import { automationArchitectDeck, automationArchitectHero } from '../../../game/data/heroes/automation-architect'
import { communityLeaderDeck, communityLeaderHero } from '../../../game/data/heroes/community-leader'
import { serialFounderDeck, serialFounderHero } from '../../../game/data/heroes/serial-founder'

// Import shared cards
import { inventorySupportCards } from '../../../game/data/inventory-support-cards'

describe('Test Coverage Analysis', () => {
  it('should identify which cards and hero powers need tests', () => {
    // Track which effects have explicit tests in hero-card-effects.test.ts
    const testedEffects = new Set([
      // Solo Hustler effects tested
      'midnight_oil',
      'hustle_hard',
      'bootstrap_capital',
      'fast_pivot',
      
      // Brand Builder effects tested (all of them based on Object.entries approach)
      'brand_vision',
      'influencer_collab',
      'content_calendar',
      'viral_post',
      'email_list',
      'visual_identity',
      'founder_story',
      'social_proof',
      'ugc_explosion',
      'personal_branding',
      'brand_builder_engage', // Hero power
    ])

    const missingTests: { hero: string; cardName: string; effect: string; text: string }[] = []

    // Check all hero decks and powers
    const heroData = [
      { hero: soloHustlerHero, deck: soloHustlerDeck },
      { hero: brandBuilderHero, deck: brandBuilderDeck },
      { hero: automationArchitectHero, deck: automationArchitectDeck },
      { hero: communityLeaderHero, deck: communityLeaderDeck },
      { hero: serialFounderHero, deck: serialFounderDeck }
    ]

    heroData.forEach(({ hero, deck }) => {
      // Check hero power
      if (hero.heroPower.effect && !testedEffects.has(hero.heroPower.effect)) {
        missingTests.push({
          hero: hero.name,
          cardName: `Hero Power: ${hero.heroPower.name}`,
          effect: hero.heroPower.effect,
          text: hero.heroPower.description
        })
      }

      // Check each card
      deck.forEach(card => {
        if (card.effect && !testedEffects.has(card.effect)) {
          missingTests.push({
            hero: hero.name,
            cardName: card.name,
            effect: card.effect,
            text: card.text
          })
        }
      })
    })

    // Check inventory support cards
    inventorySupportCards.forEach(card => {
      // These are tested in card-effects.test.ts
      const testedInventoryEffects = [
        'add_inventory_to_product',
        'add_inventory_if_empty',
        'add_inventory_to_low_stock',
        'multi_product_inventory_boost',
        'delayed_inventory_boost',
        'draw_and_inventory'
      ]
      
      if (card.effect && !testedInventoryEffects.includes(card.effect)) {
        missingTests.push({
          hero: 'Shared',
          cardName: card.name,
          effect: card.effect,
          text: card.text
        })
      }
    })

    // Note: Product sale effects are all passive, so they don't need individual tests

    // Generate report
    console.log('\n=== CARDS AND HERO POWERS MISSING TESTS ===\n')
    
    if (missingTests.length === 0) {
      console.log('✅ All cards and hero powers have tests!')
    } else {
      const grouped = missingTests.reduce((acc, item) => {
        if (!acc[item.hero]) acc[item.hero] = []
        acc[item.hero].push(item)
        return acc
      }, {} as Record<string, typeof missingTests>)

      Object.entries(grouped).forEach(([hero, items]) => {
        console.log(`\n${hero}:`)
        console.log('─'.repeat(50))
        items.forEach(item => {
          console.log(`  - ${item.cardName} (${item.effect})`)
          console.log(`    "${item.text}"`)
        })
      })

      console.log(`\nTotal missing tests: ${missingTests.length}`)
    }

    // Return the missing tests for use in other tests
    expect(missingTests.length).toBeGreaterThan(0) // We expect some missing tests
  })
}) 