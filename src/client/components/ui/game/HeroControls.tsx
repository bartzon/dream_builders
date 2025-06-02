import React from 'react'

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
      {/* Turn Status */}
      <div style={{ color: '#fff', fontSize: '14px' }}>
        {isMyTurn ? "Your Turn" : "Waiting..."}
      </div>
      
      {/* Sales Info */}
      {soldProductThisTurn && (
        <div style={{ color: '#4ade80', fontSize: '12px' }}>
          Sold {itemsSoldThisTurn} item{itemsSoldThisTurn !== 1 ? 's' : ''} this turn
        </div>
      )}
      
      {/* Simple Game Log */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '6px',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
        fontSize: '11px',
        color: '#aaa'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
          Recent Events:
        </div>
        {gameLog.length > 0 ? (
          gameLog.slice(-5).reverse().map((log, index) => (
            <div key={index} style={{ marginBottom: '3px' }}>
              {log}
            </div>
          ))
        ) : (
          <div style={{ fontStyle: 'italic' }}>No events yet</div>
        )}
      </div>
    </div>
  )
})
