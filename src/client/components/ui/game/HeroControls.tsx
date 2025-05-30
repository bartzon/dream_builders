import React from 'react'
import { BUTTON_STYLES } from '../../../constants/ui'
import { GameLog } from './GameLog'

interface HeroControlsProps {
  isMyTurn: boolean
  gameLog: string[]
  soldProductThisTurn: boolean
  itemsSoldThisTurn: number
  onEndTurn: () => void
}

export const HeroControls = React.memo(({
  isMyTurn,
  gameLog,
  soldProductThisTurn,
  itemsSoldThisTurn,
  onEndTurn
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
