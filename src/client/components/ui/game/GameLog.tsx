import React from 'react'
import { FONT_SIZES } from '../../../constants/ui'

interface GameLogProps {
  logs: string[]
  soldProductThisTurn: boolean
  itemsSoldThisTurn: number
  isMyTurn: boolean
}

export const GameLog = React.memo(({
  logs,
  soldProductThisTurn,
  itemsSoldThisTurn,
  isMyTurn
}: GameLogProps) => {
  return (
    <div>
      <h4 style={{ fontSize: FONT_SIZES.large }}>Game Log:</h4>
      
      {/* Automatic Sales Feedback */}
      {soldProductThisTurn && isMyTurn && (
        <div style={{ 
          fontSize: FONT_SIZES.body, 
          marginBottom: '5px',
          color: '#10b981',
          fontWeight: 'bold'
        }}>
          🛒 Sold {itemsSoldThisTurn} product{itemsSoldThisTurn !== 1 ? 's' : ''} automatically
        </div>
      )}
      
      {logs.map((log, i) => (
        <div key={i} style={{ fontSize: FONT_SIZES.body, marginBottom: '5px' }}>{log}</div>
      ))}
    </div>
  )
}) 