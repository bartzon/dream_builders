import React from 'react'
import { FONT_SIZES, REVENUE_GOAL } from '../../../constants/ui'

interface GameHeaderProps {
  heroName: string
  capital: number
  turn: number
  deckSize: number
  revenue: number
}

export const GameHeader = React.memo(({
  heroName,
  capital,
  turn,
  deckSize,
  revenue
}: GameHeaderProps) => {
  const goalProgress = Math.min((revenue / REVENUE_GOAL) * 100, 100)

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h1 style={{ margin: 0, fontSize: FONT_SIZES.title }}>Dream Builders</h1>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '10px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: FONT_SIZES.body }}>
            Hero: {heroName} | 
            Capital: {capital} | 
            Turn: {turn} | 
            Deck: {deckSize}
          </p>
        </div>
        
        {/* Revenue Statistics */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
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
          </div>
          
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.2)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ fontSize: FONT_SIZES.body, color: '#fcd34d' }}>Goal Progress</div>
            <div style={{ fontSize: FONT_SIZES.heading, fontWeight: 'bold', color: '#fbbf24' }}>
              {goalProgress.toFixed(1)}%
            </div>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              height: '4px', 
              borderRadius: '2px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: '#fbbf24', 
                height: '100%', 
                width: `${goalProgress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: FONT_SIZES.small, color: '#fcd34d', marginTop: '2px' }}>
              Goal: ${REVENUE_GOAL.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}) 