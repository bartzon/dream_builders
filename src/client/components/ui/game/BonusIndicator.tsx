import React from 'react'
import { COLORS } from '../../../constants/ui'

interface BonusIndicatorProps {
  bonuses: BonusInfo[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export interface BonusInfo {
  type: 'revenue' | 'cost' | 'inventory' | 'delayed'
  value: string | number
  label?: string
}

export const BonusIndicator = React.memo(({ 
  bonuses, 
  position = 'top-right' 
}: BonusIndicatorProps) => {
  if (!bonuses || bonuses.length === 0) return null

  const positionStyles = {
    'top-right': { top: '-8px', right: '-8px' },
    'top-left': { top: '-8px', left: '-8px' },
    'bottom-right': { bottom: '-8px', right: '-8px' },
    'bottom-left': { bottom: '-8px', left: '-8px' }
  }

  const getBonusStyle = (type: BonusInfo['type']) => {
    switch (type) {
      case 'revenue':
        return {
          background: COLORS.success,
          color: COLORS.white,
          border: `2px solid ${COLORS.successBorder}`
        }
      case 'cost':
        return {
          background: COLORS.warning,
          color: COLORS.black,
          border: `2px solid ${COLORS.warningBorder}`
        }
      case 'inventory':
        return {
          background: COLORS.primary,
          color: COLORS.white,
          border: `2px solid ${COLORS.primaryDark}`
        }
      case 'delayed':
        return {
          background: COLORS.tool,
          color: COLORS.white,
          border: `2px solid ${COLORS.toolBorder}`
        }
      default:
        return {
          background: COLORS.default,
          color: COLORS.white,
          border: `2px solid ${COLORS.bgLight}`
        }
    }
  }

  const formatBonusText = (bonus: BonusInfo) => {
    switch (bonus.type) {
      case 'revenue':
        return `+$${bonus.value}`
      case 'cost':
        return `-${bonus.value}`
      case 'inventory':
        return `+${bonus.value}`
      case 'delayed':
        return bonus.label || `${bonus.value}`
      default:
        return String(bonus.value)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        zIndex: 10
      }}
    >
      {bonuses.map((bonus, index) => {
        const style = getBonusStyle(bonus.type)
        return (
          <div
            key={index}
            style={{
              ...style,
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            {formatBonusText(bonus)}
          </div>
        )
      })}
    </div>
  )
}) 