import React from 'react'
import { GameLog } from './GameLog'

interface HeroControlsProps {
  isMyTurn: boolean
  gameLog: string[]
  soldProductThisTurn: boolean
  itemsSoldThisTurn: number
}

export const HeroControls = React.memo(({
  isMyTurn,
  gameLog,
  soldProductThisTurn,
  itemsSoldThisTurn
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
      <GameLog
        logs={gameLog}
        soldProductThisTurn={soldProductThisTurn}
        itemsSoldThisTurn={itemsSoldThisTurn}
        isMyTurn={isMyTurn}
      />
    </div>
  )
})
