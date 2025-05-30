import React from 'react'
import { FONT_SIZES, CARD_STYLES } from '../../../constants/ui'
import { CostDisplay } from '../CostDisplay'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'
import type { ClientCard } from '../../../types/game'

interface HandCardProps {
  card: ClientCard
  index: number
  canPlay: boolean
  isDiscardMode: boolean
  isAffected: boolean
  costInfo: {
    originalCost: number
    discount: number
    finalCost: number
  }
  onCardClick: () => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: () => void
  onMouseMove?: (e: React.MouseEvent) => void
}

export const HandCard = React.memo(({
  card,
  index,
  canPlay,
  isDiscardMode,
  isAffected,
  costInfo,
  onCardClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove
}: HandCardProps) => {
  const canInteract = isDiscardMode || canPlay

  const bonuses: BonusInfo[] = []
  if (costInfo.discount > 0) {
    bonuses.push({
      type: 'cost',
      value: costInfo.discount
    })
  }

  const baseStyle: React.CSSProperties = {
    ...CARD_STYLES,
    width: '150px',
    height: '220px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
    boxSizing: 'border-box',
    position: 'relative',
    color: 'white',
    fontFamily: '"Arial", sans-serif',
    transition: 'transform 0.2s, box-shadow 0.3s ease-out',
  }

  const affectedStyle: React.CSSProperties = isAffected
    ? { boxShadow: '0 0 12px 4px rgba(129, 230, 217, 0.8)' }
    : {}

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
            ...baseStyle,
            background: '#666',
            border: 'none',
            cursor: 'not-allowed',
            ...affectedStyle
          }}
        >
          <BonusIndicator bonuses={bonuses} position="top-right" />
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: FONT_SIZES.medium, marginBottom: '5px' }}>{card.name || 'Card'}</div>

          <div style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '5px',
            margin: '5px 0',
            minHeight: '60px',
          }}>
            <span style={{fontSize: FONT_SIZES.small, color: '#cbd5e0'}}>Ecommerce Icon</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
            <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
            <CostDisplay
              originalCost={costInfo.originalCost}
              discount={costInfo.discount}
              size="small"
              className="text-white"
            />
          </div>
        </button>
      </div>
    )
  }

  return (
    <button
      key={`${card.id || 'card'}-${index}`}
      onClick={onCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        ...baseStyle,
        background: isDiscardMode ? '#dc2626' : '#1d4ed8',
        border: isDiscardMode ? '2px solid #ef4444' : 'none',
        cursor: 'pointer',
        ...affectedStyle
      }}
    >
      <BonusIndicator bonuses={bonuses} position="top-right" />
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: FONT_SIZES.medium, marginBottom: '5px' }}>{card.name || 'Card'}</div>

      <div style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '5px',
        margin: '5px 0',
        minHeight: '60px',
      }}>
        <span style={{fontSize: FONT_SIZES.small, color: 'white'}}>Ecommerce Icon</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
        <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
        <CostDisplay
          originalCost={costInfo.originalCost}
          discount={costInfo.discount}
          size="small"
          className="text-white"
        />
      </div>

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
          fontWeight: 'bold'
        }}>
          DISCARD
        </div>
      )}
    </button>
  )
})
