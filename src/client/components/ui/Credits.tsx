import React, { useEffect, useState } from 'react'
import { FONT_SIZES, COLORS } from '../../constants/ui'

interface CreditsProps {
  isOpen: boolean
  onClose: () => void
}

export const Credits: React.FC<CreditsProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const humanCredits = [
    { role: 'Game Design & Technical Implementation', name: 'Bart Zonneveld' },
    { role: 'UI Design & Card Artwork', name: 'Calvin Walzel' },
  ]

  const aiCredits = [
    { 
      role: 'Core Game Design', 
      name: 'GPT-4o by OpenAI',
      subtitle: 'Vibe architect, balance destroyer, "just one more card" enthusiast'
    },
    { 
      role: 'Technical Architecture', 
      name: 'Claude-4-Opus MAX by Anthropic',
      subtitle: 'TypeScript sommelier, async/await philosopher, runtime optimist'
    },
    { 
      role: 'Frontend Implementation', 
      name: 'Gemini-2.5-Pro by Google',
      subtitle: 'CSS magician, component factory, "it works on my machine" specialist'
    },
  ]

  const funTitles = [
    { role: 'Chief Hallucination Prevention Officer', name: 'Bart Zonneveld' },
    { role: 'AI Prompt Whisperer', name: 'Bart Zonneveld' },
    { role: 'Pixel Perfect Alignment Therapist', name: 'Calvin Walzel' },
    { role: 'Card Balance Destruction Specialist', name: 'GPT-4o' },
    { role: 'Infinite Loop Generator', name: 'Claude-4-Opus MAX' },
    { role: '"Undefined is not a function" Expert', name: 'Gemini-2.5-Pro' },
    { role: 'Coffee-to-Code Conversion Engine', name: 'Bart Zonneveld' },
    { role: 'Bug Feature Designer', name: 'All AI Models (collectively)' },
  ]

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
        zIndex: 2000,
        backdropFilter: 'blur(8px)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
          borderRadius: '20px',
          padding: '60px 50px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(120, 80, 190, 0.3)',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: COLORS.textMuted,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%',
            transition: 'all 0.2s',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1
            style={{
              fontSize: '42px',
              marginBottom: '15px',
              color: COLORS.warningLight,
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            🎮 DREAM BUILDERS
          </h1>
          <p
            style={{
              fontSize: FONT_SIZES.body,
              color: COLORS.textMuted,
              fontStyle: 'italic',
            }}
          >
            Designed with actual ideas. Built by actual humans. 
            <br />
            Enthusiastically hallucinated by actual AI.
          </p>
        </div>

        {/* Human Contributors */}
        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: FONT_SIZES.heading,
              color: COLORS.successLight,
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            👨‍👩‍👧‍👦 Human Contributors
          </h2>
          <div style={{ paddingLeft: '20px' }}>
            {humanCredits.map((credit, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: FONT_SIZES.body, color: COLORS.textLight, marginBottom: '5px' }}>
                  {credit.name}
                </div>
                <div style={{ fontSize: FONT_SIZES.small, color: COLORS.textMuted }}>
                  {credit.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Co-Conspirators */}
        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: FONT_SIZES.heading,
              color: COLORS.textPurple,
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            🤖 AI Co-Conspirators
          </h2>
          <div style={{ paddingLeft: '20px' }}>
            {aiCredits.map((credit, index) => (
              <div key={index} style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: FONT_SIZES.body, color: COLORS.textLight, marginBottom: '5px' }}>
                  {credit.name}
                </div>
                <div style={{ fontSize: FONT_SIZES.small, color: COLORS.textMuted, marginBottom: '3px' }}>
                  {credit.role}
                </div>
                <div style={{ fontSize: '14px', color: COLORS.textPurple, fontStyle: 'italic' }}>
                  {credit.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Titles */}
        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: FONT_SIZES.heading,
              color: COLORS.warningLight,
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            📜 Totally Official Game Dev Titles
          </h2>
          <div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {funTitles.map((credit, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: index < funTitles.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                }}
              >
                <span style={{ fontSize: FONT_SIZES.small, color: COLORS.textMuted }}>
                  {credit.role}
                </span>
                <span style={{ fontSize: FONT_SIZES.small, color: COLORS.textPurple }}>
                  {credit.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Special Thanks */}
        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: FONT_SIZES.heading,
              color: COLORS.successLight,
              marginBottom: '20px',
            }}
          >
            ☕ Special Thanks
          </h2>
          <p style={{ fontSize: FONT_SIZES.body, color: COLORS.textMuted, lineHeight: '1.8' }}>
            Every player who survived past turn 5 without rage quitting.
          </p>
        </section>

        {/* Tech Stack */}
        <div
          style={{
            textAlign: 'center',
            padding: '30px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '15px',
            marginBottom: '30px',
          }}
        >
          <p style={{ fontSize: FONT_SIZES.small, color: COLORS.textMuted, marginBottom: '15px' }}>
            🚀 Built with React, TypeScript, boardgame.io, 
            <br />
            and a concerning amount of console.log statements
          </p>
          <p style={{ fontSize: '14px', color: COLORS.textPurple, marginBottom: '10px' }}>
            100% organic, free-range, vibe-coded software™
          </p>
          <p style={{ fontSize: '13px', color: COLORS.warningLight, fontStyle: 'italic' }}>
            Not a single line of code was handwritten. We asked nicely instead.
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: FONT_SIZES.large,
              color: COLORS.textLight,
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            Thanks for playing! 💜
          </p>
        </div>
      </div>
    </div>
  )
} 