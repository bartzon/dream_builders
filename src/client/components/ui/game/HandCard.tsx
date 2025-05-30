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
  
  // Base styles for the card
  const baseCardStyle: React.CSSProperties = {
    ...CARD_STYLES,
    width: '150px', // Adjusted width
    height: '220px', // Adjusted height
    borderRadius: '10px', // More rounded corners
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px', // Adjusted padding
    boxSizing: 'border-box',
    position: 'relative',
    color: 'white',
    fontFamily: '"Arial", sans-serif', // A more modern, clean font
  }

  // Styles for different card states
  const interactiveStyle: React.CSSProperties = {
    ...baseCardStyle,
    background: isDiscardMode ? 'linear-gradient(145deg, #ef4444, #dc2626)' : 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
    border: isDiscardMode ? '2px solid #f87171' : '2px solid #60a5fa',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  }

  const disabledStyle: React.CSSProperties = {
    ...baseCardStyle,
    background: 'linear-gradient(145deg, #718096, #4a5568)', // Darker, desaturated gradient
    color: '#a0aec0', // Muted text color
    border: '2px solid #718096',
    cursor: 'not-allowed',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
  
  // Check for cost discounts to display
  const bonuses: BonusInfo[] = []
  if (costInfo.discount > 0) {
    bonuses.push({
      type: 'cost',
      value: costInfo.discount
    })
  }

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
          style={disabledStyle}
        >
          <BonusIndicator bonuses={bonuses} position="top-right" />
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: FONT_SIZES.medium, marginBottom: '5px' }}>{card.name || 'Card'}</div>
          
          {/* Placeholder for image/icon - Shopify/Ecommerce themed */}
          <div style={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '5px',
            margin: '5px 0',
            minHeight: '60px', // Ensure space for potential image
          }}>
             {/* <img src="/path/to/ecommerce-icon.svg" alt={card.name} style={{width: '80%', height: '80%', objectFit: 'contain'}} /> */}
             <span style={{fontSize: FONT_SIZES.small, color: '#cbd5e0'}}>Ecommerce Icon</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
            <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
            <CostDisplay 
              originalCost={costInfo.originalCost}
              discount={costInfo.discount}
              size="small"
              className="text-gray-300" // Adjusted for disabled state
            />
          </div>
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
      style={interactiveStyle}
    >
      <BonusIndicator bonuses={bonuses} position="top-right" />
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: FONT_SIZES.medium, marginBottom: '5px' }}>{card.name || 'Card'}</div>

      {/* Placeholder for image/icon - Shopify/Ecommerce themed */}
      <div style={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'rgba(255,255,255,0.15)', 
        borderRadius: '5px',
        margin: '5px 0',
        minHeight: '60px', // Ensure space for potential image
      }}>
        {/* <img src="/path/to/ecommerce-icon.svg" alt={card.name} style={{width: '80%', height: '80%', objectFit: 'contain'}} /> */}
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
          bottom: '10px', // Adjusted position
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#facc15', // Brighter yellow for discard
          color: '#1f2937', // Darker text for contrast
          padding: '3px 8px',
          borderRadius: '5px',
          fontSize: '14px', // Slightly larger
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          DISCARD
        </div>
      )}
    </button>
  )
}) 