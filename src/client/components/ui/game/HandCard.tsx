import React from 'react'
import { FONT_SIZES, CARD_STYLES } from '../../../constants/ui'
import { CostDisplay } from '../CostDisplay'
import type { ClientCard } from '../../../types/game'

interface HandCardProps {
  card: ClientCard
  index: number
  canPlay: boolean
  isDiscardMode: boolean
  costInfo: {
    originalCost: number
    discount: number
    finalCost: number
  }
  onCardClick: () => void
  onMouseEnter: (e: React.MouseEvent) => void
  onMouseLeave: () => void
  onMouseMove: (e: React.MouseEvent) => void
}

export const HandCard = React.memo(({
  card,
  index,
  canPlay,
  isDiscardMode,
  costInfo,
  onCardClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove
}: HandCardProps) => {
  const canInteract = isDiscardMode || canPlay

  // Wrap disabled cards in a div to handle tooltip events
  if (!canInteract) {
    return (
      <div
        key={`${card.id || 'card'}-${index}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        style={{ display: 'inline-block' }}
      >
        <button
          disabled={true}
          style={{
            ...CARD_STYLES,
            background: '#666',
            color: 'white',
            border: 'none',
            cursor: 'not-allowed'
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: FONT_SIZES.medium }}>{card.name || 'Card'}</div>
          <div style={{ fontSize: FONT_SIZES.body, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Cost: 
            <CostDisplay 
              originalCost={costInfo.originalCost}
              discount={costInfo.discount}
              size="small"
              className="text-white"
            />
          </div>
          <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
        </button>
      </div>
    )
  }

  // For interactive cards (playable or discardable)
  return (
    <button
      key={`${card.id || 'card'}-${index}`}
      onClick={onCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        ...CARD_STYLES,
        background: isDiscardMode ? '#dc2626' : '#1d4ed8',
        color: 'white',
        border: isDiscardMode ? '2px solid #ef4444' : 'none',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: FONT_SIZES.medium }}>{card.name || 'Card'}</div>
      <div style={{ fontSize: FONT_SIZES.body, display: 'flex', alignItems: 'center', gap: '4px' }}>
        Cost: 
        <CostDisplay 
          originalCost={costInfo.originalCost}
          discount={costInfo.discount}
          size="small"
          className="text-white"
        />
      </div>
      <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
      
      {isDiscardMode && (
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fbbf24',
          color: '#000',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          DISCARD
        </div>
      )}
    </button>
  )
}) 