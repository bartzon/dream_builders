import React, { useState } from 'react'
import { GameCard } from './GameCard'
import type { ClientCard, EffectContextUI } from '../../../types/game'
import { cardPlayabilityRequirementsMet } from '../../../utils/cardPlayabilityHelpers'

interface PlayerHandProps {
  hand: ClientCard[]
  getCostInfo: (card: ClientCard) => { originalCost: number; discount: number; finalCost: number }
  capital: number
  isMyTurn: boolean
  effectContext: EffectContextUI
  affectedCardIds: Set<string>
  onPlayCard: (index: number) => void
  onShowTooltip: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip: () => void
  isChoiceModalOpen?: boolean
  products?: ClientCard[] // Add products to check playability
}

// Hearthstone-like card animation constants
const FAN_ANGLE = 10 // Max angle for fanning cards
const CARD_OVERLAP = 40 // Pixels to overlap cards by
const HOVER_RAISE_Y = 90 // Increased from 30 to show full card when hovering
const HOVER_SCALE = 1.15 // Scale factor on hover

export const PlayerHand = React.memo(({
  hand,
  getCostInfo,
  capital,
  isMyTurn,
  effectContext,
  affectedCardIds,
  onPlayCard,
  onShowTooltip,
  onHideTooltip,
  isChoiceModalOpen = false,
  products
}: PlayerHandProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const renderHandCard = (card: ClientCard, index: number) => {
    const costInfo = getCostInfo(card)
    const canAffordCard = costInfo.finalCost <= capital

    // Check Quick Learner special restriction
    const isQuickLearner = card.effect === 'quick_learner'
    const lastActionEffect = effectContext?.lastActionEffect
    const lastActionCard = effectContext?.lastActionCard
    const hasPlayedAction = Boolean(lastActionEffect && lastActionCard && lastActionCard.type === 'Action')

    // Check if card's playability requirements are met (e.g., requires products on board)
    const requirementsMet = cardPlayabilityRequirementsMet(card, products || [])

    const canPlay = isMyTurn && canAffordCard && (!isQuickLearner || hasPlayedAction) && requirementsMet
    const isAffected = card.id ? affectedCardIds.has(card.id) : false

    const numCards = hand.length
    const isHovered = hoveredIndex === index
    const cardAngle = numCards > 1 ? (index - (numCards - 1) / 2) * (FAN_ANGLE / (numCards -1 )) * 2 : 0;
    const cardZIndex = isHovered ? 100 : index

    const cardStyle: React.CSSProperties = {
      transform: `rotate(${cardAngle}deg)`,
      transformOrigin: 'bottom center',
      marginLeft: index > 0 ? `-${CARD_OVERLAP}px` : '0',
      zIndex: cardZIndex,
      position: 'relative',
      transition: 'z-index 0s' // Instant z-index change
    }

    return (
      <GameCard
        key={`${card.id || 'card'}-${index}`}
        card={card}
        displayMode="hand"
        canPlay={canPlay}
        isClickable={canPlay}
        onClick={() => onPlayCard(index)}
        isAffected={isAffected}
        costInfo={costInfo}
        onShowTooltip={(card, e) => {
          setHoveredIndex(index)
          onShowTooltip(card, e)
        }}
        onHideTooltip={() => {
          setHoveredIndex(null)
          onHideTooltip()
        }}
        enableHover={!isChoiceModalOpen}
        hoverScale={HOVER_SCALE}
        hoverRaiseY={HOVER_RAISE_Y}
        style={cardStyle}
      />
    )
  }

  return (
    <div style={{ position: 'relative', zIndex: 50 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: '20px',
        minHeight: '160px',
        overflow: 'visible',
        position: 'relative'
      }}>
        {hand.map(renderHandCard) }
      </div>
    </div>
  )
})
