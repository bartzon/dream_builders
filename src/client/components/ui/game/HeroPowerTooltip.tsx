import React from 'react'
import { FONT_SIZES } from '../../../constants/ui'

interface HeroPowerTooltipProps {
  visible: boolean
  x: number
  y: number
  heroPowerName: string
  heroPowerDescription: string
  cost: number
  heroId?: string
  cardsPlayedThisTurn?: number
}

export const HeroPowerTooltip = React.memo(({
  visible,
  x,
  y,
  heroPowerName,
  heroPowerDescription,
  cost,
  heroId,
  cardsPlayedThisTurn = 0
}: HeroPowerTooltipProps) => {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 10,
        top: y - 10,
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
        border: '2px solid #fbbf24',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: FONT_SIZES.tooltip,
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        pointerEvents: 'none'
      }}
    >
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: FONT_SIZES.tooltipTitle,
        color: '#fbbf24',
        marginBottom: '8px'
      }}>
        {heroPowerName}
      </div>
      <div style={{ 
        marginBottom: '8px',
        lineHeight: '1.4',
        color: '#e2e8f0'
      }}>
        {heroPowerDescription}
      </div>
      {heroId === 'community_leader' && (
        <div style={{
          marginBottom: '8px',
          fontSize: FONT_SIZES.tooltipMeta,
          color: cardsPlayedThisTurn >= 2 ? '#10b981' : '#9ca3af',
          fontStyle: 'italic'
        }}>
          {cardsPlayedThisTurn} {cardsPlayedThisTurn === 1 ? 'card' : 'cards'} played this turn
        </div>
      )}
      <div style={{ 
        background: '#fbbf24',
        color: '#000',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: FONT_SIZES.tooltipMeta,
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        Cost: {cost} Capital
      </div>
    </div>
  )
})
