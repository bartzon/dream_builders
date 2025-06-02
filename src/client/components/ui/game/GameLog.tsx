import React from 'react'
import { COLORS, FONT_SIZES } from '../../../constants/ui'
import { GameLogEntry } from './GameLogEntry'
import type { GameState } from '../../../../game/state'

interface GameLogProps {
  isOpen: boolean
  onClose: () => void
  gameLog: string[]
  gameState: GameState
  playerID: string
}

export const GameLog: React.FC<GameLogProps> = ({ isOpen, onClose, gameLog, gameState, playerID }) => {
  if (!isOpen) return null

  // Debug logging
  console.log('GameLog component - gameLog prop:', gameLog);
  console.log('GameLog length:', gameLog.length);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '70vh',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(120, 80, 190, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '15px'
        }}>
          <h2 style={{ 
            fontSize: FONT_SIZES.heading, 
            color: COLORS.warningLight,
            margin: 0
          }}>
            📜 Game Log
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = COLORS.white
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = COLORS.textMuted
            }}
          >
            ✕
          </button>
        </div>

        {/* Log Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '20px',
        }}>
          {gameLog.length === 0 ? (
            <p style={{
              color: COLORS.textMuted,
              fontSize: FONT_SIZES.body,
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              No game events yet...
            </p>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {[...gameLog].reverse().map((entry, index) => (
                <GameLogEntry
                  key={index}
                  entry={entry}
                  index={index}
                  gameState={gameState}
                  playerID={playerID}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: FONT_SIZES.small,
          color: COLORS.textMuted,
          textAlign: 'center'
        }}>
          Showing {gameLog.length} events • Most recent first
        </div>
      </div>
    </div>
  )
} 