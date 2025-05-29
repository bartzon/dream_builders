"use client"

import { useState } from "react"
import { allHeroes } from "../../../../game/data/heroes"

// Font size constants (matching game-screen)
const FONT_SIZES = {
  title: '38px',
  heading: '25px',
  subheading: '23px',
  large: '20px',
  body: '19px',
  medium: '18px',
  small: '16px',
} as const

interface HeroSelectionProps {
  onHeroSelected: (heroId: string) => void
}

export default function HeroSelection({ onHeroSelected }: HeroSelectionProps) {
  const [selectedHero, setSelectedHero] = useState<string | null>(null)

  const getHeroColor = (color: string) => {
    switch (color) {
      case 'Red': return '#dc2626'
      case 'Blue': return '#2563eb'
      case 'Green': return '#059669'
      case 'White': return '#6b7280'
      case 'Black': return '#374151'
      default: return '#6b7280'
    }
  }

  const handleStartGame = () => {
    if (selectedHero) {
      // Store selected hero for game setup
      localStorage.setItem('selectedHero', selectedHero);
      onHeroSelected(selectedHero);
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
      color: 'white',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: FONT_SIZES.title,
          marginBottom: '16px'
        }}>
          Choose Your Path
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: FONT_SIZES.large,
          color: '#94a3b8',
          maxWidth: '600px'
        }}>
          Select the entrepreneur that matches your playstyle and begin building your dream business.
        </p>
      </div>

      {/* Hero Cards */}
      <div style={{
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '40px',
        maxWidth: '1600px'
      }}>
        {allHeroes.map((hero) => (
          <div
            key={hero.id}
            onClick={() => setSelectedHero(hero.id)}
            style={{
              background: selectedHero === hero.id 
                ? 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.3))'
                : 'rgba(0,0,0,0.3)',
              border: selectedHero === hero.id 
                ? '3px solid #3b82f6' 
                : '2px solid #374151',
              borderRadius: '12px',
              padding: '24px',
              width: '280px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: selectedHero === hero.id ? 'scale(1.05)' : 'scale(1)',
              boxShadow: selectedHero === hero.id 
                ? '0 20px 40px rgba(59, 130, 246, 0.3)' 
                : '0 10px 25px rgba(0,0,0,0.3)'
            }}
          >
            {/* Hero Portrait */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getHeroColor(hero.color)}, ${getHeroColor(hero.color)}aa)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: 'white',
                border: '4px solid rgba(255,255,255,0.2)'
              }}>
                {hero.name.charAt(4)} {/* Gets first letter after "The " */}
              </div>
            </div>

            {/* Hero Info */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: FONT_SIZES.heading,
                marginBottom: '8px',
                color: getHeroColor(hero.color)
              }}>
                {hero.name}
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: FONT_SIZES.small,
                color: '#94a3b8',
                fontStyle: 'italic',
                marginBottom: '12px'
              }}>
                {hero.flavorText}
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: FONT_SIZES.body,
                color: '#e2e8f0'
              }}>
                {hero.playstyle}
              </p>
            </div>

            {/* Hero Power */}
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: FONT_SIZES.medium,
                  color: '#fbbf24'
                }}>
                  {hero.heroPower.name}
                </h4>
                <span style={{
                  background: '#fbbf24',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: FONT_SIZES.small,
                  fontWeight: 'bold'
                }}>
                  {hero.heroPower.cost}
                </span>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: FONT_SIZES.small,
                color: '#d1d5db',
                lineHeight: '1.4'
              }}>
                {hero.heroPower.description}
              </p>
            </div>

            {/* Color Badge */}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                background: getHeroColor(hero.color),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: FONT_SIZES.small,
                fontWeight: 'bold'
              }}>
                {hero.color}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartGame}
        disabled={!selectedHero}
        style={{
          background: selectedHero 
            ? 'linear-gradient(to right, #059669, #047857)' 
            : '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          fontSize: FONT_SIZES.heading,
          fontWeight: 'bold',
          cursor: selectedHero ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          transform: selectedHero ? 'scale(1)' : 'scale(0.95)',
          boxShadow: selectedHero 
            ? '0 10px 25px rgba(5, 150, 105, 0.4)' 
            : '0 5px 15px rgba(0,0,0,0.2)',
          opacity: selectedHero ? 1 : 0.5
        }}
      >
        🚀 Dream Big!
      </button>

      {/* Helper Text */}
      {!selectedHero && (
        <p style={{
          marginTop: '20px',
          fontSize: FONT_SIZES.body,
          color: '#6b7280',
          textAlign: 'center'
        }}>
          Select a hero to begin your entrepreneurial journey
        </p>
      )}
    </div>
  )
} 