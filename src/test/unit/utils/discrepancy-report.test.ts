import { describe, it, expect } from 'vitest'

// Import all card effect implementations
import { cardEffects } from '../../../game/logic/cardEffects'
import { heroAbilityEffects } from '../../../game/logic/heroAbilities'

// Import all hero data
import { soloHustlerDeck, soloHustlerHero } from '../../../game/data/heroes/solo-hustler'
import { brandBuilderDeck, brandBuilderHero } from '../../../game/data/heroes/brand-builder'
import { automationArchitectDeck, automationArchitectHero } from '../../../game/data/heroes/automation-architect'
import { communityLeaderDeck, communityLeaderHero } from '../../../game/data/heroes/community-leader'
import { serialFounderDeck, serialFounderHero } from '../../../game/data/heroes/serial-founder'

// Import shared cards
import { sharedProductPool } from '../../../game/data/shared-products'
import { inventorySupportCards } from '../../../game/data/inventory-support-cards'

interface DiscrepancyReport {
  hero: string
  cardName: string
  effectName: string
  cardText: string
  issue: string
}

describe('Card Implementation Discrepancy Report', () => {
  it('should generate a comprehensive report of all discrepancies', () => {
    const discrepancies: DiscrepancyReport[] = []
    
    // Check all hero decks
    const heroData = [
      { hero: soloHustlerHero, deck: soloHustlerDeck },
      { hero: brandBuilderHero, deck: brandBuilderDeck },
      { hero: automationArchitectHero, deck: automationArchitectDeck },
      { hero: communityLeaderHero, deck: communityLeaderDeck },
      { hero: serialFounderHero, deck: serialFounderDeck }
    ]

    // Check hero-specific cards
    heroData.forEach(({ hero, deck }) => {
      // Check hero power
      if (hero.heroPower.effect && !heroAbilityEffects[hero.heroPower.effect]) {
        discrepancies.push({
          hero: hero.name,
          cardName: `Hero Power: ${hero.heroPower.name}`,
          effectName: hero.heroPower.effect,
          cardText: hero.heroPower.description,
          issue: 'Hero power effect not implemented'
        })
      }

      // Check each card in the deck
      deck.forEach(card => {
        if (card.effect) {
          if (!cardEffects[card.effect]) {
            discrepancies.push({
              hero: hero.name,
              cardName: card.name,
              effectName: card.effect,
              cardText: card.text,
              issue: 'Card effect not implemented'
            })
          } else {
            // Check for passive effects that might need special handling
            const effectFn = cardEffects[card.effect]
            if (effectFn.toString().includes('passiveEffect')) {
              if (card.keywords?.includes('Recurring')) {
                discrepancies.push({
                  hero: hero.name,
                  cardName: card.name,
                  effectName: card.effect,
                  cardText: card.text,
                  issue: 'Recurring effect marked as passive - may need implementation in processPassiveEffects'
                })
              }
            }
          }
        }
      })
    })

    // Check shared product pool
    sharedProductPool.forEach(product => {
      if (product.effect && !cardEffects[product.effect]) {
        discrepancies.push({
          hero: 'Shared',
          cardName: product.name,
          effectName: product.effect!,
          cardText: product.text,
          issue: 'Product sale effect not implemented'
        })
      }
    })

    // Check inventory support cards
    inventorySupportCards.forEach(card => {
      if (card.effect && !cardEffects[card.effect]) {
        discrepancies.push({
          hero: 'Shared',
          cardName: card.name,
          effectName: card.effect,
          cardText: card.text,
          issue: 'Inventory support effect not implemented'
        })
      }
    })

    // Generate report
    if (discrepancies.length > 0) {
      console.log('\n=== CARD IMPLEMENTATION DISCREPANCY REPORT ===\n')
      
      // Group by hero
      const groupedByHero = discrepancies.reduce((acc, disc) => {
        if (!acc[disc.hero]) acc[disc.hero] = []
        acc[disc.hero].push(disc)
        return acc
      }, {} as Record<string, DiscrepancyReport[]>)

      Object.entries(groupedByHero).forEach(([hero, issues]) => {
        console.log(`\n${hero}:`)
        console.log('─'.repeat(50))
        
        issues.forEach(issue => {
          console.log(`\n  Card: ${issue.cardName}`)
          console.log(`  Effect: ${issue.effectName}`)
          console.log(`  Text: "${issue.cardText}"`)
          console.log(`  Issue: ${issue.issue}`)
        })
      })

      console.log('\n=== SUMMARY ===')
      console.log(`Total discrepancies found: ${discrepancies.length}`)
      console.log('─'.repeat(50))
      
      // Count by type
      const byIssueType = discrepancies.reduce((acc, disc) => {
        acc[disc.issue] = (acc[disc.issue] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      Object.entries(byIssueType).forEach(([issue, count]) => {
        console.log(`${issue}: ${count}`)
      })
      
      console.log('\n')
    } else {
      console.log('\n✅ No discrepancies found! All card effects are implemented.\n')
    }

    // The test passes regardless - we just want the report
    expect(true).toBe(true)
  })

  it('should check for effect naming consistency', () => {
    const namingIssues: string[] = []

    // Check that effect names follow consistent patterns
    Object.keys(cardEffects).forEach(effectName => {
      // Check for snake_case
      if (!effectName.match(/^[a-z_]+$/)) {
        namingIssues.push(`Effect "${effectName}" doesn't follow snake_case convention`)
      }

      // Check that hero power effects include hero name
      if (effectName.includes('_engage') || effectName.includes('_grind') || 
          effectName.includes('_deploy') || effectName.includes('_viral') || 
          effectName.includes('_double_down')) {
        const heroEffectPatterns = [
          'solo_hustler_',
          'brand_builder_',
          'automation_architect_',
          'community_leader_',
          'serial_founder_'
        ]
        if (!heroEffectPatterns.some(pattern => effectName.startsWith(pattern))) {
          namingIssues.push(`Hero power effect "${effectName}" doesn't include hero name prefix`)
        }
      }
    })

    if (namingIssues.length > 0) {
      console.log('\n=== EFFECT NAMING ISSUES ===')
      namingIssues.forEach(issue => console.log(`- ${issue}`))
      console.log('')
    }

    expect(namingIssues).toHaveLength(0)
  })
}) 