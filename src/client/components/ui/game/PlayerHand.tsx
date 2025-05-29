import React from 'react'
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

  const renderHandCard = (card: ClientCard, index: number) => {
    const costInfo = getCostInfo(card)
    const canAffordCard = costInfo.finalCost <= capital
    
    // Check Quick Learner special restriction
    const isQuickLearner = card.effect === 'quick_learner'
    const lastActionEffect = effectContext?.lastActionEffect
    const lastActionCard = effectContext?.lastActionCard
    const hasPlayedAction = Boolean(lastActionEffect && lastActionCard && lastActionCard.type === 'Action')
    
    const canPlay = isMyTurn && canAffordCard && (!isQuickLearner || hasPlayedAction)
    
    return (
      <HandCard
        key={`${card.id || 'card'}-${index}`}
        card={card}
        index={index}
        canPlay={canPlay}
        isDiscardMode={isDiscardMode}
        costInfo={costInfo}
        onCardClick={() => isDiscardMode ? onMakeChoice(index) : onPlayCard(index)}
        onMouseEnter={(e) => onShowTooltip(card, e)}
        onMouseLeave={onHideTooltip}
        onMouseMove={(e) => onShowTooltip(card, e)}
      />
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
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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