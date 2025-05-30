"use client"

import { useState } from "react"
import { allHeroes } from "../../../../game/data/heroes"
import { Credits } from "../Credits"
import { COLORS, BUTTON_STYLES } from "../../../constants/ui"

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
  const [showCredits, setShowCredits] = useState(false)

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
      justifyContent: 'space-between',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Credits Modal */}
      <Credits isOpen={showCredits} onClose={() => setShowCredits(false)} />

      {/* Header Text - Might need adjustment or removal later */}
      <div style={{
        textAlign: 'center',
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

      {/* Selected Hero Large Image Display and Details */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '20px 0',
        gap: '40px'
      }}>
        {selectedHero && allHeroes.find(hero => hero.id === selectedHero) ? (
          <>
            <img
              src={allHeroes.find(hero => hero.id === selectedHero)?.image}
              alt={allHeroes.find(hero => hero.id === selectedHero)?.name}
              style={{
                maxWidth: '40%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '16px',
                border: '4px solid #3b82f6',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            />
            {(() => {
              const currentHero = allHeroes.find(hero => hero.id === selectedHero);
              if (!currentHero) return null;
              return (
                <div style={{
                  maxWidth: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  color: '#e2e8f0'
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: FONT_SIZES.title,
                    color: getHeroColor(currentHero.color),
                    textAlign: 'left'
                  }}>
                    {currentHero.name}
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: FONT_SIZES.large,
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    textAlign: 'left'
                  }}>
                    {currentHero.flavorText}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: FONT_SIZES.body,
                    lineHeight: '1.6',
                    textAlign: 'left'
                  }}>
                    {currentHero.playstyle}
                  </p>
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #374151'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: FONT_SIZES.heading,
                        color: '#fbbf24'
                      }}>
                        {currentHero.heroPower.name}
                      </h4>
                      <span style={{
                        background: '#fbbf24',
                        color: '#000',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: FONT_SIZES.medium,
                        fontWeight: 'bold'
                      }}>
                        Cost: {currentHero.heroPower.cost}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: FONT_SIZES.body,
                      color: '#d1d5db',
                      lineHeight: '1.5'
                    }}>
                      {currentHero.heroPower.description}
                    </p>
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          <div style={{
            width: '450px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: FONT_SIZES.heading,
            color: '#4b5563',
            border: '4px dashed #374151',
            borderRadius: '16px'
          }}>
            Select a Hero Below
          </div>
        )}
      </div>

      {/* Hero Cards Row */}
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '10px',
        paddingBottom: '20px',
        width: '100%',
        maxWidth: '1187px',
        overflowX: 'auto',
      }}>
        {allHeroes.map((hero) => (
          <div
            key={hero.id}
            onClick={() => setSelectedHero(hero.id)}
            style={{
              background: selectedHero === hero.id
                ? 'linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2))'
                : 'rgba(0,0,0,0.2)',
              border: selectedHero === hero.id
                ? '2px solid #3b82f6'
                : '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
              width: '220px',
              minWidth: '220px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: selectedHero === hero.id ? 'scale(1.03)' : 'scale(1)',
              boxShadow: selectedHero === hero.id
                ? '0 10px 20px rgba(59, 130, 246, 0.2)'
                : '0 5px 10px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Hero Portrait (Smaller) */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <img
                src={hero.image}
                alt={hero.name}
                style={{
                  width: '120px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
              />
            </div>

            {/* Hero Info (Concise) */}
            <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
              <h3 style={{
                margin: 0,
                fontSize: FONT_SIZES.body,
                marginBottom: '4px',
                color: getHeroColor(hero.color),
                minHeight: '2.4em',
              }}>
                {hero.name}
              </h3>
            </div>

            {/* Color Badge (Optional for small cards) */}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                background: getHeroColor(hero.color),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: FONT_SIZES.small,
                fontWeight: 'bold'
              }}>
                {hero.color}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Start Button and Helper Text Container */}
      <div style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}>
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
            boxShadow: selectedHero
              ? '0 10px 25px rgba(5, 150, 105, 0.4)'
              : '0 5px 15px rgba(0,0,0,0.2)',
            opacity: selectedHero ? 1 : 0.5
          }}
        >
          🚀 Dream Big!
        </button>

        {!selectedHero && (
          <p style={{
            marginTop: '15px',
            fontSize: FONT_SIZES.body,
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Select a hero to begin your entrepreneurial journey
          </p>
        )}
        
        {/* Credits Button */}
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => setShowCredits(true)}
            style={{
              ...BUTTON_STYLES,
              backgroundColor: 'transparent',
              color: COLORS.textPurple,
              border: `1px solid ${COLORS.textPurple}`,
              padding: '8px 16px',
              fontSize: FONT_SIZES.small,
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: 0.8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.textPurple
              e.currentTarget.style.color = COLORS.white
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = COLORS.textPurple
              e.currentTarget.style.opacity = '0.8'
            }}
          >
            Credits
          </button>
        </div>
      </div>
    </div>
  )
}
