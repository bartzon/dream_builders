import React from 'react'
import { FONT_SIZES, COLORS, BUTTON_STYLES } from '../../../constants/ui'
import { GAME_CONFIG } from '../../../../game/constants'
import type { EffectContextUI } from '../../../types/game'

interface GameHeaderProps {
  heroName: string
  capital: number
  turn: number
  deckSize: number
  revenue: number
  effectContext?: EffectContextUI
  hasShoestringBudget?: boolean
  onCreditsClick?: () => void
}

export const GameHeader = React.memo(({
  heroName,
  capital,
  turn,
  deckSize,
  revenue,
  effectContext,
  hasShoestringBudget,
  onCreditsClick
}: GameHeaderProps) => {
  const revenueProgress = (revenue / GAME_CONFIG.REVENUE_GOAL) * 100;
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px',
      padding: '15px',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '10px'
    }}>
      {/* Title and Hero */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
          <h2 style={{ 
            fontSize: FONT_SIZES.heading, 
            margin: 0
          }}>
            Dream Builders
          </h2>
          {onCreditsClick && (
            <button
              onClick={onCreditsClick}
              style={{
                ...BUTTON_STYLES,
                backgroundColor: 'transparent',
                color: COLORS.textPurple,
                border: `1px solid ${COLORS.textPurple}`,
                padding: '4px 12px',
                fontSize: FONT_SIZES.small,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.textPurple
                e.currentTarget.style.color = COLORS.white
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = COLORS.textPurple
              }}
            >
              Credits
            </button>
          )}
        </div>
        <div style={{ fontSize: FONT_SIZES.body }}>
          Hero: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
            {heroName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>
      
      {/* Game Stats */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: FONT_SIZES.body }}>
          Turn: <span style={{ fontWeight: 'bold' }}>{turn}</span>
        </div>
        <div style={{ fontSize: FONT_SIZES.body }}>
          Capital: <span style={{ color: '#34d399', fontWeight: 'bold' }}>{capital}</span>
        </div>
        <div style={{ fontSize: FONT_SIZES.body }}>
          Deck: <span style={{ fontWeight: 'bold' }}>{deckSize}</span> cards
        </div>
        {effectContext?.delayedInventoryBoostTurns && effectContext.delayedInventoryBoostTurns > 0 && (
          <div style={{ 
            fontSize: FONT_SIZES.small, 
            color: '#a78bfa',
            marginTop: '5px'
          }}>
            📦 +1 inventory in {effectContext.delayedInventoryBoostTurns} turn{effectContext.delayedInventoryBoostTurns > 1 ? 's' : ''}
          </div>
        )}
        {hasShoestringBudget && (!effectContext?.cardsPlayedThisTurn || effectContext.cardsPlayedThisTurn === 0) && (
          <div style={{ 
            fontSize: FONT_SIZES.small, 
            color: '#fbbf24',
            marginTop: '5px'
          }}>
            💰 First card -1 cost
          </div>
        )}
      </div>
      
      {/* Revenue Progress */}
      <RevenueProgress revenue={revenue} progress={revenueProgress} />
    </div>
  )
})

// Revenue progress component
const RevenueProgress = ({ revenue, progress }: { revenue: number; progress: number }) => (
  <div style={{ minWidth: '200px' }}>
    <div style={{ 
      background: 'rgba(16, 185, 129, 0.2)', 
      padding: '8px 12px', 
      borderRadius: '6px',
      border: '1px solid #10b981'
    }}>
      <div style={{ fontSize: FONT_SIZES.body, color: '#6ee7b7' }}>Revenue</div>
      <div style={{ fontSize: FONT_SIZES.heading, fontWeight: 'bold', color: '#10b981' }}>
        ${revenue.toLocaleString()}
      </div>
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        height: '4px', 
        borderRadius: '2px',
        marginTop: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          background: '#10b981', 
          height: '100%', 
          width: `${Math.min(progress, 100)}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ fontSize: FONT_SIZES.small, color: '#6ee7b7', marginTop: '2px' }}>
        Goal: ${GAME_CONFIG.REVENUE_GOAL.toLocaleString()} ({progress.toFixed(1)}%)
      </div>
    </div>
  </div>
) 