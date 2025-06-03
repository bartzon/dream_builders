import React, { useState, useEffect } from 'react'
import { Credits } from '../Credits'
import { Tutorial } from './Tutorial'
import { FONT_SIZES, COLORS, BUTTON_STYLES } from '../../../constants/ui'

interface SplashScreenProps {
  onStartGame: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame }) => {
  const [showCredits, setShowCredits] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in effect
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <>
      {!showCredits && !showTutorial && !showTrailer && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            background: `url('/dream_builders/assets/background.png') center/cover no-repeat, radial-gradient(ellipse at top, #3b2a4f, #1a1a2e 70%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 3000,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {/* Background effects */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent, rgba(0,0,0,0.4))',
              pointerEvents: 'none',
            }}
          />

          {/* Main content container */}
          <div
            style={{
              textAlign: 'center',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'transform 0.5s ease-out',
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '60px 0',
            }}
          >
            {/* Game Logo/Title */}
            <div>
              <img
                src="/dream_builders/assets/logo.png"
                alt="Dream Builders"
                style={{
                  maxWidth: '500px',
                  width: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.5)) drop-shadow(0 5px 15px rgba(0,0,0,0.5))',
                }}
              />
              <p
                style={{
                  fontSize: FONT_SIZES.heading,
                  color: COLORS.textMuted,
                  fontStyle: 'italic',
                  opacity: 0.8,
                  marginTop: '20px',
                }}
              >
                Build Your Startup Empire
              </p>
            </div>

            {/* Buttons container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              {/* New Game Button */}
              <button
                onClick={onStartGame}
                style={{
                  ...BUTTON_STYLES,
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  padding: '18px 50px',
                  fontSize: FONT_SIZES.heading,
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4), 0 4px 10px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  letterSpacing: '1px',
                  minWidth: '250px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(5, 150, 105, 0.5), 0 6px 15px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.4), 0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                NEW GAME
              </button>

              {/* Trailer Button */}
              <button
                onClick={() => setShowTrailer(true)}
                style={{
                  ...BUTTON_STYLES,
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1f2937',
                  padding: '16px 50px',
                  fontSize: FONT_SIZES.large,
                  borderRadius: '12px',
                  boxShadow: '0 6px 15px rgba(251, 191, 36, 0.3), 0 3px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  minWidth: '250px',
                  fontWeight: 'bold',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4), 0 5px 12px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(251, 191, 36, 0.3), 0 3px 8px rgba(0,0,0,0.3)'
                }}
              >
                TRAILER
              </button>

              {/* Tutorial Button */}
              <button
                onClick={() => setShowTutorial(true)}
                style={{
                  ...BUTTON_STYLES,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  padding: '16px 50px',
                  fontSize: FONT_SIZES.large,
                  borderRadius: '12px',
                  boxShadow: '0 6px 15px rgba(59, 130, 246, 0.3), 0 3px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  minWidth: '250px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4), 0 5px 12px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(59, 130, 246, 0.3), 0 3px 8px rgba(0,0,0,0.3)'
                }}
              >
                HOW TO PLAY
              </button>

              {/* Credits Button */}
              <button
                onClick={() => setShowCredits(true)}
                style={{
                  ...BUTTON_STYLES,
                  background: 'linear-gradient(135deg, #7850be 0%, #5a3a9a 100%)',
                  color: 'white',
                  padding: '16px 50px',
                  fontSize: FONT_SIZES.large,
                  borderRadius: '12px',
                  boxShadow: '0 6px 15px rgba(120, 80, 190, 0.3), 0 3px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  minWidth: '250px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(120, 80, 190, 0.4), 0 5px 12px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(120, 80, 190, 0.3), 0 3px 8px rgba(0,0,0,0.3)'
                }}
              >
                CREDITS
              </button>
            </div>

            {/* Decorative elements */}
            <div
              style={{
                fontSize: FONT_SIZES.small,
                color: COLORS.textMuted,
                opacity: 0.6,
              }}
            >
              <p>100% AI-Generated Code</p>
              <p style={{ marginTop: '5px', fontSize: '12px' }}>
                No humans were harmed in the making of this game
              </p>
            </div>
          </div>

          {/* Animated background particles */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: COLORS.warningLight,
                  borderRadius: '50%',
                  opacity: Math.random() * 0.5 + 0.1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
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
            zIndex: 4000,
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowTrailer(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
              borderRadius: '20px',
              padding: '40px',
              width: '80vw',
              maxWidth: '1400px',
              maxHeight: '85vh',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(120, 80, 190, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: COLORS.textMuted,
                fontSize: '32px',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = COLORS.white;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = COLORS.textMuted;
              }}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <h2 style={{ color: COLORS.warningLight, marginBottom: '20px', fontSize: FONT_SIZES.title }}>
              Game Trailer
            </h2>
            <div style={{ width: '100%', height: '70vh', maxHeight: '700px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <iframe
                src="https://drive.google.com/file/d/1RRwSLSAWT7Po_9u9_G0jtKMFX4iilDaa/preview"
                width="100%"
                height="100%"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: 'none', borderRadius: '12px', width: '100%', height: '100%' }}
                title="Dream Builders Trailer"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      <Credits isOpen={showCredits} onClose={() => setShowCredits(false)} />

      {/* Tutorial Modal */}
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(20px) translateX(-10px);
          }
        }
      `}</style>
    </>
  )
} 