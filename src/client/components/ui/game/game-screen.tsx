"use client"

import { useState, useEffect } from "react"

// Font size constants (increased by 25% from previous)
const FONT_SIZES = {
  title: '38px',        // Main title
  heading: '25px',      // Section headings  
  subheading: '23px',   // Subsection headings
  large: '20px',        // Large text (revenue stats)
  body: '19px',         // Regular body text
  medium: '18px',       // Medium text (buttons, card names)
  small: '16px',        // Small text (card details)
  tooltip: '23px',      // Tooltip main text
  tooltipTitle: '25px', // Tooltip titles
  tooltipMeta: '19px'   // Tooltip metadata
} as const

// Common styles
const CARD_STYLES = {
  padding: '12px',
  borderRadius: '5px',
  minWidth: '120px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  fontWeight: 'bold',
  fontSize: FONT_SIZES.medium
} as const

const BUTTON_STYLES = {
  padding: '15px',
  border: 'none',
  borderRadius: '5px',
  fontSize: FONT_SIZES.medium,
  fontWeight: 'bold'
} as const

interface Card {
  id?: string
  name: string
  cost: number
  type: string
  keywords?: string[]
  text?: string
  effect?: string
  resilience?: number
  synergyCondition?: string
  inventory?: number
  revenuePerSale?: number
  isActive?: boolean
  overheadCost?: number
  appeal?: number
}

interface TooltipProps {
  card?: Card
  visible: boolean
  x: number
  y: number
}

function CardTooltip({ card, visible, x, y }: TooltipProps) {
  if (!visible || !card) return null

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'product': return '#059669'
      case 'tool': return '#7c3aed'
      case 'action': return '#dc2626'
      case 'employee': return '#2563eb'
      default: return '#6b7280'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 10,
        top: y - 10,
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
        border: '2px solid #374151',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: FONT_SIZES.tooltip,
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        pointerEvents: 'none'
      }}
    >
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #374151', 
        paddingBottom: '8px', 
        marginBottom: '8px' 
      }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: FONT_SIZES.tooltipTitle,
          color: '#f8fafc'
        }}>
          {card.name}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4px'
        }}>
          <span style={{ 
            background: getTypeColor(card.type),
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: FONT_SIZES.tooltipMeta,
            fontWeight: 'bold'
          }}>
            {card.type}
          </span>
          <span style={{ 
            background: '#fbbf24',
            color: '#000',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: FONT_SIZES.tooltipMeta,
            fontWeight: 'bold'
          }}>
            Cost: {card.cost}
          </span>
        </div>
      </div>

      {/* Keywords */}
      {card.keywords && card.keywords.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: FONT_SIZES.tooltipMeta, color: '#94a3b8', marginBottom: '4px' }}>Keywords:</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {card.keywords.map((keyword, i) => (
              <span key={i} style={{
                background: '#4338ca',
                color: 'white',
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: FONT_SIZES.medium
              }}>
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {card.text && (
        <div style={{ 
          marginBottom: '8px',
          lineHeight: '1.4',
          color: '#e2e8f0'
        }}>
          {card.text}
        </div>
      )}

      {/* Effect */}
      {card.effect && (
        <div style={{ 
          marginBottom: '8px',
          lineHeight: '1.4',
          color: '#fbbf24',
          fontStyle: 'italic'
        }}>
          <strong>Effect:</strong> {card.effect}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: FONT_SIZES.tooltipMeta }}>
        {card.resilience !== undefined && (
          <div style={{ color: '#10b981' }}>
            <strong>Resilience:</strong> {card.resilience}
          </div>
        )}
        {card.inventory !== undefined && (
          <div style={{ color: '#3b82f6' }}>
            <strong>Inventory:</strong> {card.inventory}
          </div>
        )}
        {card.revenuePerSale !== undefined && (
          <div style={{ color: '#059669' }}>
            <strong>Revenue/Sale:</strong> {card.revenuePerSale}
          </div>
        )}
        {card.overheadCost !== undefined && (
          <div style={{ color: '#dc2626' }}>
            <strong>Overhead:</strong> {card.overheadCost}
          </div>
        )}
        {card.appeal !== undefined && (
          <div style={{ color: '#8b5cf6' }}>
            <strong>Appeal:</strong> {card.appeal}
          </div>
        )}
        {card.isActive !== undefined && (
          <div style={{ color: card.isActive ? '#10b981' : '#6b7280' }}>
            <strong>Status:</strong> {card.isActive ? 'Active' : 'Inactive'}
          </div>
        )}
      </div>

      {/* Synergy Condition */}
      {card.synergyCondition && (
        <div style={{ 
          marginTop: '8px',
          padding: '6px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '4px',
          fontSize: FONT_SIZES.tooltipMeta,
          color: '#c4b5fd'
        }}>
          <strong>Synergy:</strong> {card.synergyCondition}
        </div>
      )}
    </div>
  )
}

interface HeroPowerTooltipProps {
  visible: boolean
  x: number
  y: number
  heroPowerName: string
  heroPowerDescription: string
  cost: number
}

function HeroPowerTooltip({ visible, x, y, heroPowerName, heroPowerDescription, cost }: HeroPowerTooltipProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 10,
        top: y - 10,
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
        border: '2px solid #fbbf24',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: FONT_SIZES.tooltip,
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        pointerEvents: 'none'
      }}
    >
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: FONT_SIZES.tooltipTitle,
        color: '#fbbf24',
        marginBottom: '8px'
      }}>
        {heroPowerName}
      </div>
      <div style={{ 
        marginBottom: '8px',
        lineHeight: '1.4',
        color: '#e2e8f0'
      }}>
        {heroPowerDescription}
      </div>
      <div style={{ 
        background: '#fbbf24',
        color: '#000',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: FONT_SIZES.tooltipMeta,
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        Cost: {cost} Capital
      </div>
    </div>
  )
}

interface GameScreenProps {
  gameState: unknown // Our existing BoardGame.io state
  moves: Record<string, (...args: unknown[]) => void>
  playerID: string
  isMyTurn: boolean
  events?: {
    endTurn?: () => void
  }
}

export default function GameScreen({ gameState: G, moves, playerID, isMyTurn, events }: GameScreenProps) {
  const [gameLog, setGameLog] = useState<string[]>([])
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    card?: Card
    x: number
    y: number
  }>({ visible: false, x: 0, y: 0 })
  
  const [heroPowerTooltip, setHeroPowerTooltip] = useState<{
    visible: boolean
    x: number
    y: number
  }>({ visible: false, x: 0, y: 0 })

  const [lastTeamRevenue, setLastTeamRevenue] = useState(0)

  // Extract basic game state
  const gameState = G as Record<string, unknown>
  const players = gameState.players as Record<string, unknown>
  const currentPlayer = players[playerID] as Record<string, unknown>
  
  const hand = Array.isArray(currentPlayer.hand) ? currentPlayer.hand as Card[] : []
  const board = currentPlayer.board as Record<string, Card[]>
  const products = Array.isArray(board?.Products) ? board.Products : []
  const tools = Array.isArray(board?.Tools) ? board.Tools : []

  // Check if automatic sales happened this turn
  const effectContext = (gameState.effectContext as Record<string, Record<string, unknown>>)?.[playerID]
  const itemsSoldThisTurn = effectContext?.itemsSoldThisTurn as number || 0
  const soldProductThisTurn = effectContext?.soldProductThisTurn as boolean || false

  // Hero power costs from game constants
  const HERO_ABILITY_COSTS: Record<string, number> = {
    marketer: 2,
    developer: 1,
    operator: 2,
    visionary: 1,
    Marketer: 2,
    Developer: 1,
    Operator: 2,
    Visionary: 1,
    solo_hustler: 1,
    brand_builder: 2,
    automation_architect: 2,
    community_leader: 1,
    serial_founder: 2,
  }

  // Hero power descriptions
  const HERO_POWER_INFO: Record<string, { name: string, description: string }> = {
    marketer: { name: 'Marketing Blitz', description: 'Gain 2 capital, draw 1 card, all Products +$10k this turn' },
    developer: { name: 'Code Sprint', description: 'Next card costs 2 less, draw 1 card' },
    operator: { name: 'Operational Excellence', description: 'Gain 1 capital, all cards +$20k revenue this turn' },
    visionary: { name: 'Visionary Insight', description: 'Draw 3 cards, discard 1, gain $50k' },
    Marketer: { name: 'Marketing Blitz', description: 'Gain 2 capital, draw 1 card, all Products +$10k this turn' },
    Developer: { name: 'Code Sprint', description: 'Next card costs 2 less, draw 1 card' },
    Operator: { name: 'Operational Excellence', description: 'Gain 1 capital, all cards +$20k revenue this turn' },
    Visionary: { name: 'Visionary Insight', description: 'Draw 3 cards, discard 1, gain $50k' },
    solo_hustler: { name: 'Grind', description: 'Draw 1 card. If it\'s a Product, reduce its cost by 1 this turn' },
    brand_builder: { name: 'Engage', description: 'Give a Product +1 Appeal this turn' },
    automation_architect: { name: 'Deploy Script', description: 'Gain 1 recurring Capital next turn' },
    community_leader: { name: 'Go Viral', description: 'If you played 2+ cards this turn, add a copy of a Product in play to your inventory' },
    serial_founder: { name: 'Double Down', description: 'Choose one: draw a card OR refresh 1 used Product' },
  }

  const heroName = String(currentPlayer.hero || 'Unknown')
  const heroCost = HERO_ABILITY_COSTS[heroName] || 2
  const heroPowerInfo = HERO_POWER_INFO[heroName] || { name: 'Hero Power', description: 'Use your hero\'s special ability' }

  // Game statistics
  const REVENUE_GOAL = 1_000_000
  const teamRevenue = Number(gameState.teamRevenue || 0)
  const playerRevenue = Number(currentPlayer.revenue || 0)
  const goalProgress = Math.min((teamRevenue / REVENUE_GOAL) * 100, 100)

  // Automatic cha-ching sound when team revenue increases (products sold automatically)
  useEffect(() => {
    if (teamRevenue > lastTeamRevenue && lastTeamRevenue > 0) {
      // Revenue increased, play cha-ching sound
      try {
        const audio = new Audio('/sounds/cha_ching_sound.mp3')
        audio.volume = 0.7
        audio.play().catch(() => {
          // Ignore audio errors in case file doesn't exist
        })
      } catch {
        // Ignore audio errors
      }
    }
    setLastTeamRevenue(teamRevenue)
  }, [teamRevenue, lastTeamRevenue])

  // Handle tooltip
  const showTooltip = (card: Card, event: React.MouseEvent) => {
    setTooltip({
      visible: true,
      card,
      x: event.clientX,
      y: event.clientY
    })
  }

  const hideTooltip = () => {
    setTooltip({ visible: false, x: 0, y: 0 })
  }

  // Handle hero power tooltip
  const showHeroPowerTooltip = (event: React.MouseEvent) => {
    setHeroPowerTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY
    })
  }

  const hideHeroPowerTooltip = () => {
    setHeroPowerTooltip({ visible: false, x: 0, y: 0 })
  }

  // Handle play card
  const handlePlayCard = (cardIndex: number) => {
    if (!isMyTurn) return
    moves.playCard?.(cardIndex)
    setGameLog(prev => [`Played card ${cardIndex}`, ...prev.slice(0, 4)])
  }

  // Handle end turn
  const handleEndTurn = () => {
    if (isMyTurn && events?.endTurn) {
      events.endTurn()
      setGameLog(prev => [`Turn ended`, ...prev.slice(0, 4)])
    }
  }

  // Handle hero power
  const handleUseHeroPower = () => {
    if (isMyTurn && !currentPlayer.heroAbilityUsed && Number(currentPlayer.capital || 0) >= heroCost) {
      moves.useHeroAbility?.()
      setGameLog(prev => [`Used hero power`, ...prev.slice(0, 4)])
    }
  }

  const canUseHeroPower = isMyTurn && !currentPlayer.heroAbilityUsed && Number(currentPlayer.capital || 0) >= heroCost

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Tooltips */}
      <CardTooltip {...tooltip} />
      <HeroPowerTooltip 
        {...heroPowerTooltip} 
        heroPowerName={heroPowerInfo.name}
        heroPowerDescription={heroPowerInfo.description}
        cost={heroCost}
      />

      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0, fontSize: FONT_SIZES.title }}>Dream Builders</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '10px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: FONT_SIZES.body }}>
              Hero: {heroName} | 
              Capital: {Number(currentPlayer.capital || 0)} | 
              Turn: {String(gameState.turn || 1)}
            </p>
          </div>
          
          {/* Revenue Statistics */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              padding: '8px 12px', 
              borderRadius: '6px',
              border: '1px solid #10b981'
            }}>
              <div style={{ fontSize: FONT_SIZES.body, color: '#6ee7b7' }}>Your Revenue</div>
              <div style={{ fontSize: FONT_SIZES.heading, fontWeight: 'bold', color: '#10b981' }}>
                ${playerRevenue.toLocaleString()}
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.2)', 
              padding: '8px 12px', 
              borderRadius: '6px',
              border: '1px solid #3b82f6'
            }}>
              <div style={{ fontSize: FONT_SIZES.body, color: '#93c5fd' }}>Team Revenue</div>
              <div style={{ fontSize: FONT_SIZES.heading, fontWeight: 'bold', color: '#3b82f6' }}>
                ${teamRevenue.toLocaleString()}
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(251, 191, 36, 0.2)', 
              padding: '8px 12px', 
              borderRadius: '6px',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ fontSize: FONT_SIZES.body, color: '#fcd34d' }}>Goal Progress</div>
              <div style={{ fontSize: FONT_SIZES.heading, fontWeight: 'bold', color: '#fbbf24' }}>
                {goalProgress.toFixed(1)}%
              </div>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                height: '4px', 
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  background: '#fbbf24', 
                  height: '100%', 
                  width: `${goalProgress}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontSize: FONT_SIZES.small, color: '#fcd34d', marginTop: '2px' }}>
                Goal: ${REVENUE_GOAL.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{ display: 'flex', flex: 1, gap: '20px' }}>
        
        {/* Left - Hero and Controls */}
        <div style={{
          width: '250px',
          background: 'rgba(0,0,0,0.2)',
          padding: '15px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <h3 style={{ margin: 0, fontSize: FONT_SIZES.subheading }}>Hero: {heroName}</h3>
          
          <button
            onClick={handleUseHeroPower}
            disabled={!canUseHeroPower}
            onMouseEnter={showHeroPowerTooltip}
            onMouseLeave={hideHeroPowerTooltip}
            onMouseMove={showHeroPowerTooltip}
            style={{
              ...BUTTON_STYLES,
              backgroundColor: canUseHeroPower ? '#4f46e5' : '#666',
              color: 'white',
              cursor: canUseHeroPower ? 'pointer' : 'not-allowed'
            }}
          >
            Hero Power ({heroCost}) {currentPlayer.heroAbilityUsed ? '(Used)' : ''}
          </button>

          <button
            onClick={handleEndTurn}
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
            
            {gameLog.map((log, i) => (
              <div key={i} style={{ fontSize: FONT_SIZES.body, marginBottom: '5px' }}>{log}</div>
            ))}
          </div>
        </div>

        {/* Center - Game Board */}
        <div style={{
          flex: 1,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Tools */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: FONT_SIZES.subheading }}>Your Tools ({tools.length})</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {tools.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  border: '2px dashed #666', 
                  borderRadius: '5px',
                  color: '#999',
                  fontSize: FONT_SIZES.body
                }}>
                  No tools
                </div>
              ) : (
                tools.map((tool, i) => (
                  <div 
                    key={i} 
                    style={{
                      ...CARD_STYLES,
                      background: '#7c3aed',
                      border: '1px solid #8b5cf6'
                    }}
                    onMouseEnter={(e) => showTooltip(tool, e)}
                    onMouseLeave={hideTooltip}
                    onMouseMove={(e) => showTooltip(tool, e)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'white', fontSize: FONT_SIZES.medium }}>{tool.name || 'Tool'}</div>
                    <div style={{ fontSize: FONT_SIZES.body, marginBottom: '3px', color: '#e2e8f0' }}>Cost: {tool.cost || 0}</div>
                    {tool.isActive !== undefined && (
                      <div style={{ 
                        fontSize: FONT_SIZES.medium, 
                        color: tool.isActive ? '#10b981' : '#6b7280',
                        fontWeight: 'bold'
                      }}>
                        {tool.isActive ? 'Active' : 'Inactive'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Products */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: FONT_SIZES.subheading }}>Your Products ({products.length})</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {products.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  border: '2px dashed #666', 
                  borderRadius: '5px',
                  color: '#999',
                  fontSize: FONT_SIZES.body
                }}>
                  No products
                </div>
              ) : (
                products.map((product, i) => (
                  <div 
                    key={i} 
                    style={{
                      ...CARD_STYLES,
                      background: '#065f46',
                      border: '1px solid #059669'
                    }}
                    onMouseEnter={(e) => showTooltip(product, e)}
                    onMouseLeave={hideTooltip}
                    onMouseMove={(e) => showTooltip(product, e)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: FONT_SIZES.medium }}>{product.name || 'Product'}</div>
                    <div style={{ fontSize: FONT_SIZES.body, marginBottom: '3px' }}>Cost: {product.cost || 0}</div>
                    {product.inventory !== undefined && (
                      <div style={{ fontSize: FONT_SIZES.body, marginBottom: '8px' }}>Stock: {product.inventory}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hand */}
          <div>
            <h4 style={{ fontSize: FONT_SIZES.subheading }}>Your Hand ({hand.length})</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {hand.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  border: '2px dashed #666', 
                  borderRadius: '5px',
                  color: '#999',
                  fontSize: FONT_SIZES.body
                }}>
                  No cards
                </div>
              ) : (
                hand.map((card, i) => {
                  const canPlay = isMyTurn && Number(card.cost || 0) <= Number(currentPlayer.capital || 0)
                  
                  // Wrap disabled cards in a div to handle tooltip events
                  if (!canPlay) {
                    return (
                      <div
                        key={i}
                        onMouseEnter={(e) => showTooltip(card, e)}
                        onMouseLeave={hideTooltip}
                        onMouseMove={(e) => showTooltip(card, e)}
                        style={{ display: 'inline-block' }}
                      >
                        <button
                          disabled={true}
                          style={{
                            ...CARD_STYLES,
                            background: '#666',
                            color: 'white',
                            border: 'none',
                            cursor: 'not-allowed'
                          }}
                        >
                          <div style={{ fontWeight: 'bold', fontSize: FONT_SIZES.medium }}>{card.name || 'Card'}</div>
                          <div style={{ fontSize: FONT_SIZES.body }}>Cost: {card.cost || 0}</div>
                          <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
                        </button>
                      </div>
                    )
                  }
                  
                  // For enabled cards, use the original button with events
                  return (
                    <button
                      key={i}
                      onClick={() => handlePlayCard(i)}
                      onMouseEnter={(e) => showTooltip(card, e)}
                      onMouseLeave={hideTooltip}
                      onMouseMove={(e) => showTooltip(card, e)}
                      style={{
                        ...CARD_STYLES,
                        background: '#1d4ed8',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: FONT_SIZES.medium }}>{card.name || 'Card'}</div>
                      <div style={{ fontSize: FONT_SIZES.body }}>Cost: {card.cost || 0}</div>
                      <div style={{ fontSize: FONT_SIZES.small }}>{card.type || 'Unknown'}</div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 