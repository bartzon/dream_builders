import React from 'react'
import { COLORS, FONT_SIZES, BUTTON_STYLES } from '../../../constants/ui'
import { formatCurrency } from '../../../utils/formatHelpers'
import { GAME_CONFIG } from '../../../../game/constants'

interface GameOverModalProps {
  isOpen: boolean
  isVictory: boolean
  revenue: number
  turn: number
  onNewGame: () => void
  onContinue: () => void
}

const getRandomMessage = (isVictory: boolean) => {
  const victoryMessages = [
    "🎉 You're officially a pixel profit prophet!",
    "🚀 From zero to hero! Your investors are crying tears of joy.",
    "💰 Cha-ching! Time to buy that yacht you've been eyeballing.",
    "🏆 Silicon Valley called, they want your autograph!",
    "⭐ You did it! Your business school professor would be so proud.",
    "🎊 Success! Now you can finally afford guacamole at Chipotle."
  ]
  
  const defeatMessages = [
    "💔 Don't worry, even Apple started in a garage!",
    "🌱 Every failure is just a stepping stone to success. Or bankruptcy. But mostly success!",
    "🔄 Time to pivot! Maybe try selling NFTs of your failures?",
    "📈 Remember: it's not a loss, it's a 'learning experience' for your memoir.",
    "🎮 Hey, at least you didn't invest in crypto... right?",
    "☕ Take a coffee break and try again. Entrepreneurship is 90% caffeine anyway!"
  ]
  
  const messages = isVictory ? victoryMessages : defeatMessages
  return messages[Math.floor(Math.random() * messages.length)]
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory,
  revenue,
  turn,
  onNewGame,
  onContinue
}) => {
  if (!isOpen) return null
  
  const encouragement = getRandomMessage(isVictory)
  const revenueGoal = GAME_CONFIG.REVENUE_GOAL
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: isVictory 
            ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)' 
            : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          border: `2px solid ${isVictory ? COLORS.success : COLORS.danger}`,
          textAlign: 'center',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Result Icon */}
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          animation: isVictory ? 'bounce 1s ease-in-out infinite' : 'shake 0.5s',
        }}>
          {isVictory ? '🏆' : '📉'}
        </div>
        
        {/* Title */}
        <h1 style={{
          fontSize: FONT_SIZES.title,
          color: COLORS.white,
          marginBottom: '15px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}>
          {isVictory ? 'VICTORY!' : 'GAME OVER'}
        </h1>
        
        {/* Stats */}
        <div style={{
          fontSize: FONT_SIZES.large,
          color: COLORS.white,
          marginBottom: '20px',
          lineHeight: 1.6,
        }}>
          <div>
            Final Revenue: <strong>{formatCurrency(revenue)}</strong>
          </div>
          <div>
            Goal: <strong>{formatCurrency(revenueGoal)}</strong>
          </div>
          <div style={{ fontSize: FONT_SIZES.body, marginTop: '10px' }}>
            Completed in {turn} turns
          </div>
        </div>
        
        {/* Reason */}
        <div style={{
          fontSize: FONT_SIZES.body,
          color: COLORS.textLight,
          marginBottom: '25px',
          fontStyle: 'italic',
        }}>
          {isVictory 
            ? `You reached the revenue goal of ${formatCurrency(revenueGoal)}!`
            : "Ran out of moves - no cards to play and no products to sell."
          }
        </div>
        
        {/* Witty Encouragement */}
        <div style={{
          fontSize: FONT_SIZES.body,
          color: COLORS.warningLight,
          marginBottom: '30px',
          padding: '15px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
        }}>
          {encouragement}
        </div>
        
        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
        }}>
          <button
            onClick={onContinue}
            style={{
              ...BUTTON_STYLES,
              background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
              color: 'white',
              padding: '12px 24px',
              fontSize: FONT_SIZES.body,
            }}
          >
            View Board
          </button>
          
          <button
            onClick={onNewGame}
            style={{
              ...BUTTON_STYLES,
              background: isVictory
                ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: isVictory ? '#1f2937' : 'white',
              padding: '12px 24px',
              fontSize: FONT_SIZES.body,
              fontWeight: 'bold',
            }}
          >
            New Game
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  )
} 