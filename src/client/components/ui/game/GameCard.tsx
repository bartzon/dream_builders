import React, { useState } from 'react'
import type { ClientCard } from '../../../types/game'
import { UniversalCard, type CardDisplayMode } from './UniversalCard'
import { BonusIndicator, type BonusInfo } from './BonusIndicator'

interface GameCardProps {
  card: ClientCard
  displayMode?: CardDisplayMode
  // Interaction props
  isClickable?: boolean
  onClick?: () => void
  canPlay?: boolean
  isDiscardMode?: boolean
  // Visual state props
  isAffected?: boolean
  isSelected?: boolean
  showBonuses?: boolean
  // Cost info
  costInfo?: {
    originalCost: number
    discount: number
    finalCost: number
  }
  // Revenue bonus (for products)
  revenueBonus?: number
  // Bonus indicators
  bonuses?: BonusInfo[]
  // Tooltip handlers
  onShowTooltip?: (card: ClientCard, e: React.MouseEvent) => void
  onHideTooltip?: () => void
  // Hover configuration
  enableHover?: boolean
  hoverScale?: number
  hoverRaiseY?: number
  // Additional styling
  style?: React.CSSProperties
  className?: string
}

export const GameCard: React.FC<GameCardProps> = React.memo(({
  card,
  displayMode = 'board',
  isClickable = false,
  onClick,
  canPlay = false,
  isDiscardMode = false,
  isAffected = false,
  isSelected = false,
  showBonuses = true,
  costInfo,
  revenueBonus = 0,
  bonuses = [],
  onShowTooltip,
  onHideTooltip,
  enableHover = true,
  hoverScale = 1.05,
  hoverRaiseY = 5,
  style = {},
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Check if this is a product with no inventory
  const hasNoInventory = card.type === 'Product' && card.inventory === 0

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (enableHover) {
      setIsHovered(true)
    }
    if (onShowTooltip) {
      onShowTooltip(card, e)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (onHideTooltip) {
      onHideTooltip()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (onShowTooltip) {
      onShowTooltip(card, e)
    }
  }

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick()
    }
  }

  // Determine if the card should show as playable
  const showPlayableBorder = canPlay && !isDiscardMode
  const canInteract = isClickable || (canPlay && !isDiscardMode) || isDiscardMode

  // Apply hover effects
  const hoverTransform = isHovered && enableHover
    ? `translateY(-${hoverRaiseY}px) scale(${hoverScale})`
    : 'scale(1)'

  // Extract transform, transformOrigin, and transition from the style prop
  const { transform: existingTransform, transformOrigin, transition: existingTransition, ...restStyle } = style
  
  // Combine transforms - put hover transform first
  const combinedTransform = existingTransform 
    ? `${hoverTransform} ${existingTransform}`
    : hoverTransform

  // Combine transitions
  const baseTransition = 'transform 0.3s ease-out, filter 0.3s ease-out, box-shadow 0.3s ease-out'
  const combinedTransition = existingTransition 
    ? `${baseTransition}, ${existingTransition}`
    : baseTransition

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    transition: combinedTransition,
    transform: combinedTransform,
    transformOrigin: transformOrigin || 'center',
    cursor: canInteract ? 'pointer' : 'default',
    filter: !canPlay && displayMode === 'hand' ? 'brightness(0.8)' : hasNoInventory ? 'grayscale(50%)' : 'none',
    boxShadow: isHovered && enableHover ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
    opacity: hasNoInventory ? 0.6 : 1,
    ...restStyle
  }

  return (
    <div 
      style={containerStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <UniversalCard
        card={card}
        displayMode={displayMode}
        isClickable={canInteract}
        showPlayableBorder={showPlayableBorder}
        onClick={handleClick}
        isSelected={isSelected || isDiscardMode}
        isAffected={isAffected}
        costInfo={costInfo}
        showBonuses={showBonuses}
        revenueBonus={revenueBonus}
      />
      
      {/* Bonus indicators */}
      {bonuses.length > 0 && (
        <BonusIndicator 
          bonuses={bonuses} 
          position={displayMode === 'hand' ? 'top-right' : 'bottom-left'} 
        />
      )}
      
      {/* No inventory indicator */}
      {hasNoInventory && displayMode !== 'hand' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ef4444',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          pointerEvents: 'none',
          zIndex: 10,
          whiteSpace: 'nowrap'
        }}>
          NO INVENTORY
        </div>
      )}
      
      {/* Discard mode indicator */}
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
          zIndex: 10
        }}>
          DISCARD
        </div>
      )}
    </div>
  )
}) 