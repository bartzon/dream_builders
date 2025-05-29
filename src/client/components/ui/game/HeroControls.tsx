import React from 'react'
import { FONT_SIZES, BUTTON_STYLES } from '../../../constants/ui'
import { GameLog } from './GameLog'

interface HeroControlsProps {
  heroName: string
  heroCost: number
  isHeroPowerUsed: boolean
  canUseHeroPower: boolean
  isMyTurn: boolean
  gameLog: string[]
  soldProductThisTurn: boolean
  itemsSoldThisTurn: number
  onUseHeroPower: () => void
  onEndTurn: () => void
  onHeroPowerMouseEnter: (e: React.MouseEvent) => void
  onHeroPowerMouseLeave: () => void
  onHeroPowerMouseMove: (e: React.MouseEvent) => void
}

export const HeroControls = React.memo(({
  heroName,
  heroCost,
  isHeroPowerUsed,
  canUseHeroPower,
  isMyTurn,
  gameLog,
  soldProductThisTurn,
  itemsSoldThisTurn,
  onUseHeroPower,
  onEndTurn,
  onHeroPowerMouseEnter,
  onHeroPowerMouseLeave,
  onHeroPowerMouseMove
}: HeroControlsProps) => {
  return (
    <div style={{
      width: '250px',
      background: 'rgba(0,0,0,0.2)',
      padding: '15px',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <h3 style={{ margin: 0, fontSize: FONT_SIZES.subheading }}>Hero: {heroName}</h3>
      
      <button
        onClick={onUseHeroPower}
        disabled={!canUseHeroPower}
        onMouseEnter={onHeroPowerMouseEnter}
        onMouseLeave={onHeroPowerMouseLeave}
        onMouseMove={onHeroPowerMouseMove}
        style={{
          ...BUTTON_STYLES,
          backgroundColor: canUseHeroPower ? '#4f46e5' : '#666',
          color: 'white',
          cursor: canUseHeroPower ? 'pointer' : 'not-allowed'
        }}
      >
        Hero Power ({heroCost}) {isHeroPowerUsed ? '(Used)' : ''}
      </button>

      <button
        onClick={onEndTurn}
        disabled={!isMyTurn}
        style={{
          ...BUTTON_STYLES,
          backgroundColor: !isMyTurn ? '#666' : '#059669',
          color: 'white',
          cursor: !isMyTurn ? 'not-allowed' : 'pointer'
        }}
      >
        End Turn
      </button>

      <GameLog 
        logs={gameLog}
        soldProductThisTurn={soldProductThisTurn}
        itemsSoldThisTurn={itemsSoldThisTurn}
        isMyTurn={isMyTurn}
      />
    </div>
  )
}) 