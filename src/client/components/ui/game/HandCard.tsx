import React from 'react'
import type { ClientCard } from '../../../types/game'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'

interface HandCardProps {
  card: ClientCard
  canPlay: boolean
  isDiscardMode: boolean
  isAffected: boolean
  costInfo: {
    originalCost: number
    discount: number
    finalCost: number
  }
  onCardClick: () => void
  onMouseEnterCard?: (e: React.MouseEvent) => void
  onMouseLeaveCard?: () => void
  onMouseMoveCard?: (e: React.MouseEvent) => void
}

export const HandCard = React.memo(({
  card,
  canPlay,
  isDiscardMode,
  isAffected,
  costInfo,
  onCardClick,
  onMouseEnterCard,
  onMouseLeaveCard,
  onMouseMoveCard,
}: HandCardProps) => {
  const canInteract = isDiscardMode || canPlay
  const showPlayableBorder = canPlay && !isDiscardMode

  return (
    <div style={{ position: 'relative' }}>
      <UniversalCard
        card={card}
        displayMode={'hand' as CardDisplayMode}
        isClickable={canInteract}
        showPlayableBorder={showPlayableBorder}
        onClick={canInteract ? onCardClick : undefined}
        isSelected={isDiscardMode}
        isAffected={isAffected}
        costInfo={costInfo}
        showBonuses={true}
        onMouseEnterCard={onMouseEnterCard}
        onMouseLeaveCard={onMouseLeaveCard}
        onMouseMoveCard={onMouseMoveCard}
      />
      {isDiscardMode && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fbbf24',
          color: '#000',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '12px',
          fontWeight: 'bold',
          pointerEvents: 'none',
        }}>
          DISCARD
        </div>
      )}
    </div>
  )
})
