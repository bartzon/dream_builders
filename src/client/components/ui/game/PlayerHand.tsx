import React, { useState } from 'react'
import { FONT_SIZES } from '../../../constants/ui'
import { HandCard } from './HandCard'
import type { ClientCard, EffectContextUI } from '../../../types/game'

interface PlayerHandProps {
  hand: ClientCard[]
  pendingChoiceType?: string
  midnightOilPending: boolean
  getCostInfo: (card: ClientCard) => { originalCost: number; discount: number; finalCost: number }
  capital: number
  isMyTurn: boolean
  effectContext: EffectContextUI
  onPlayCard: (index: number) => void
  onMakeChoice: (index: number) => void
  onShowTooltip: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip: () => void
}

// Hearthstone-like card animation constants
const FAN_ANGLE = 10 // Max angle for fanning cards
const CARD_OVERLAP = 40 // Pixels to overlap cards by
const HOVER_RAISE_Y = 30 // Pixels to raise card on hover
const HOVER_SCALE = 1.15 // Scale factor on hover

export const PlayerHand = React.memo(({
  hand,
  pendingChoiceType,
  midnightOilPending,
  getCostInfo,
  capital,
  isMyTurn,
  effectContext,
  onPlayCard,
  onMakeChoice,
  onShowTooltip,
  onHideTooltip
}: PlayerHandProps) => {
  const isDiscardMode = pendingChoiceType === 'discard'
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null) // Added state for hovered card

  const handleMouseEnterCard = (index: number, card: ClientCard, e: React.MouseEvent) => {
    setHoveredIndex(index)
    onShowTooltip(card, e)
  }

  const handleMouseLeaveCard = () => {
    setHoveredIndex(null)
    onHideTooltip()
  }

  const renderHandCard = (card: ClientCard, index: number) => {
    const costInfo = getCostInfo(card)
    const canAffordCard = costInfo.finalCost <= capital

    // Check Quick Learner special restriction
    const isQuickLearner = card.effect === 'quick_learner'
    const lastActionEffect = effectContext?.lastActionEffect
    const lastActionCard = effectContext?.lastActionCard
    const hasPlayedAction = Boolean(lastActionEffect && lastActionCard && lastActionCard.type === 'Action')

    const canPlay = isMyTurn && canAffordCard && (!isQuickLearner || hasPlayedAction)

    const numCards = hand.length
    const isHovered = hoveredIndex === index
    const cardAngle = numCards > 1 ? (index - (numCards - 1) / 2) * (FAN_ANGLE / (numCards -1 )) * 2 : 0;
    const cardRaiseY = isHovered ? -HOVER_RAISE_Y : 0
    const cardScale = isHovered ? HOVER_SCALE : 1
    const cardZIndex = isHovered ? 100 : index

    const cardStyle: React.CSSProperties = {
      transition: 'transform 0.2s ease-out, filter 0.2s ease-out',
      transform: `translateY(${cardRaiseY}px) rotate(${cardAngle}deg) scale(${cardScale})`,
      marginLeft: index > 0 ? `-${CARD_OVERLAP}px` : '0',
      zIndex: cardZIndex,
      position: 'relative', // Needed for z-index to work
    }

    return (
      <div style={cardStyle} // Apply dynamic style here
        onMouseEnter={(e) => handleMouseEnterCard(index, card, e)}
        onMouseLeave={handleMouseLeaveCard}
        onMouseMove={(e) => onShowTooltip(card, e)} // Keep existing mouse move for tooltip
      >
        <HandCard
          key={`${card.id || 'card'}-${index}`}
          card={card}
          index={index}
          canPlay={canPlay}
          isDiscardMode={isDiscardMode}
          costInfo={costInfo}
          onCardClick={() => isDiscardMode ? onMakeChoice(index) : onPlayCard(index)}
         // Remove individual card mouse enter/leave/move, handled by the div wrapper now
        />
      </div>
    )
  }

  return (
    <div>
      <h4 style={{ fontSize: FONT_SIZES.subheading }}>
        Your Hand ({hand.length})
        {isDiscardMode && (
          <span style={{
            color: '#ef4444',
            marginLeft: '10px',
            fontSize: FONT_SIZES.body
          }}>
            - Click a card to discard it
          </span>
        )}
        {midnightOilPending && (
          <span style={{
            color: '#10b981',
            marginLeft: '10px',
            fontSize: FONT_SIZES.body,
            fontWeight: 'bold',
            animation: 'pulse 1s infinite'
          }}>
            ✨ Drawing 3 cards...
          </span>
        )}
      </h4>
      <div style={{
        display: 'flex',
        justifyContent: 'center', // Center the cards
        alignItems: 'flex-end', // Align cards to the bottom
        paddingBottom: `${HOVER_RAISE_Y + 20}px`, // Add padding to prevent cut-off
        minHeight: '200px' // Ensure enough space for raised cards
      }}>
        {hand.length === 0 ? (
          <div style={{
            padding: '20px',
            border: '2px dashed #666',
            borderRadius: '5px',
            color: '#999',
            fontSize: FONT_SIZES.body
          }}>
            No cards
          </div>
        ) : (
          hand.map(renderHandCard)
        )}
      </div>
    </div>
  )
})
