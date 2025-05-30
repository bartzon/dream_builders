import React from 'react'
import { FONT_SIZES, REVENUE_GOAL } from '../../../constants/ui'
import type { EffectContextUI } from '../../../types/game'

interface GameHeaderProps {
  heroName: string
  capital: number
  turn: number
  deckSize: number
  revenue: number
  effectContext?: EffectContextUI
  hasShoestringBudget?: boolean
}

export const GameHeader = React.memo(({
  heroName,
  capital,
  turn,
  deckSize,
  revenue,
  effectContext,
  hasShoestringBudget
}: GameHeaderProps) => {
  const revenueProgress = (revenue / REVENUE_GOAL) * 100;
  
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
        <h2 style={{ 
          fontSize: FONT_SIZES.heading, 
          marginBottom: '5px' 
        }}>
          Dream Builders
        </h2>
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
        Goal: ${REVENUE_GOAL.toLocaleString()} ({progress.toFixed(1)}%)
      </div>
    </div>
  </div>
) 