import React, { useState, useMemo, useCallback } from 'react'
import { COLORS, FONT_SIZES } from '../../../constants/ui'
import { CardTooltip } from './CardTooltip'
import type { ClientCard } from '../../../types/game'
import type { GameState } from '../../../../game/state'
import { allHeroes } from '../../../../game/data/heroes'
import { sharedProductPool } from '../../../../game/data/shared-products'
import { inventorySupportCards } from '../../../../game/data/inventory-support-cards'

interface GameLogEntryProps {
  entry: string
  index: number
  gameState: GameState
  playerID: string
}

export const GameLogEntry: React.FC<GameLogEntryProps> = ({ entry, index, gameState, playerID }) => {
  const [hoveredCard, setHoveredCard] = useState<ClientCard | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Get all cards from the game state to match names
  const allCards = useMemo(() => {
    const player = gameState.players[playerID]
    const cards: Map<string, ClientCard> = new Map()
    
    // Add cards from hand
    player.hand.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    
    // Add cards from board
    player.board.Products.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    player.board.Tools.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    player.board.Employees.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    
    // Add cards from deck
    player.deck.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    
    // Add all hero cards
    allHeroes.forEach(hero => {
      hero.starterDeck.forEach(card => {
        if (card.name) cards.set(card.name, card as ClientCard)
      })
    })
    
    // Add shared products
    sharedProductPool.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    
    // Add inventory support cards
    inventorySupportCards.forEach(card => {
      if (card.name) cards.set(card.name, card as ClientCard)
    })
    
    return cards
  }, [gameState, playerID])

  // Get hero powers
  const heroPowers = useMemo(() => {
    const powers: Map<string, { name: string, description: string, cost: number }> = new Map()
    allHeroes.forEach(hero => {
      powers.set(hero.heroPower.name, hero.heroPower)
      // Also add hero name mapping to power
      powers.set(`${hero.name}'s hero power: ${hero.heroPower.name}`, hero.heroPower)
    })
    return powers
  }, [])

  const handleMouseEnter = useCallback((card: ClientCard, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setHoveredCard(card)
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null)
  }, [])

  // Parse the entry and create hoverable elements
  const parsedContent = useMemo(() => {
    // Create an array of all matches with their positions
    const matches: Array<{
      start: number
      end: number
      text: string
      card: ClientCard
      type: 'card' | 'heroPower'
    }> = []
    
    // Find all card name matches
    allCards.forEach((card, cardName) => {
      const regex = new RegExp(`\\b${cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
      let match
      
      while ((match = regex.exec(entry)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + cardName.length,
          text: cardName,
          card: card,
          type: 'card'
        })
      }
    })
    
    // Find hero power matches
    heroPowers.forEach((power, powerText) => {
      const regex = new RegExp(`\\b${powerText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
      let match
      
      while ((match = regex.exec(entry)) !== null) {
        const heroPowerCard: ClientCard = {
          name: power.name,
          cost: power.cost,
          type: 'Hero Power',
          text: power.description,
        }
        
        matches.push({
          start: match.index,
          end: match.index + powerText.length,
          text: powerText,
          card: heroPowerCard,
          type: 'heroPower'
        })
      }
    })
    
    // Sort matches by start position and remove overlapping matches
    matches.sort((a, b) => a.start - b.start)
    const nonOverlapping: typeof matches = []
    let lastEnd = -1
    
    for (const match of matches) {
      if (match.start >= lastEnd) {
        nonOverlapping.push(match)
        lastEnd = match.end
      }
    }
    
    // Build the parsed content
    const parts: React.ReactElement[] = []
    let lastIndex = 0
    
    nonOverlapping.forEach((match, idx) => {
      // Add text before the match
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {entry.substring(lastIndex, match.start)}
          </span>
        )
      }
      
      // Add the hoverable element
      parts.push(
        <span
          key={`${match.type}-${idx}`}
          style={{
            color: match.type === 'heroPower' ? COLORS.primary : COLORS.warningLight,
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
          }}
          onMouseEnter={(e) => handleMouseEnter(match.card, e)}
          onMouseLeave={handleMouseLeave}
        >
          {match.text}
        </span>
      )
      
      lastIndex = match.end
    })
    
    // Add any remaining text
    if (lastIndex < entry.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {entry.substring(lastIndex)}
        </span>
      )
    }
    
    return parts.length > 0 ? <>{parts}</> : <span>{entry}</span>
  }, [entry, allCards, heroPowers, handleMouseEnter, handleMouseLeave])

  return (
    <>
      <div
        style={{
          padding: '10px 15px',
          background: index === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          fontSize: FONT_SIZES.small,
          color: index === 0 ? COLORS.warningLight : COLORS.textLight,
          borderLeft: index === 0 ? '3px solid ' + COLORS.warning : 'none',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        {parsedContent}
      </div>
      
      {hoveredCard && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 10000,
          }}
        >
          <CardTooltip
            card={hoveredCard}
            visible={true}
            displayModeOverride="tooltip"
          />
        </div>
      )}
    </>
  )
} 