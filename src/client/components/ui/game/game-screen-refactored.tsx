"use client"

import { useState, useEffect, useCallback } from "react"
import { DebugPanel } from '../DebugPanel'
import { CardTooltip } from './CardTooltip'
import { HeroPowerTooltip } from './HeroPowerTooltip'
import { GameHeader } from './GameHeader'
import { HeroControls } from './HeroControls'
import { PlayerHand } from './PlayerHand'
import { useGameState } from '../../../hooks/useGameState'
import { useTooltip } from '../../../hooks/useTooltip'
import { useCardDiscount } from '../../../hooks/useCardDiscount'
import { FONT_SIZES, CARD_STYLES, HERO_ABILITY_COSTS, HERO_POWER_INFO } from '../../../constants/ui'
import type { GameState } from '../../../../game/state'

interface GameScreenProps {
  gameState: unknown
  moves: Record<string, (...args: unknown[]) => void>
  playerID: string
  isMyTurn: boolean
  events?: {
    endTurn?: () => void
  }
}

export default function GameScreen({ gameState: G, moves, playerID, isMyTurn, events }: GameScreenProps) {
  const [gameLog, setGameLog] = useState<string[]>([])
  const [lastPlayerRevenue, setLastPlayerRevenue] = useState(0)

  // Use custom hooks
  const { uiState, effectContext, toolsAndEmployees } = useGameState(G, playerID)
  const {
    cardTooltip,
    heroPowerTooltip,
    showCardTooltip,
    hideCardTooltip,
    showHeroPowerTooltip,
    hideHeroPowerTooltip
  } = useTooltip()
  const { getCostInfo } = useCardDiscount(effectContext, uiState.tools, uiState.employees)

  // Extract derived state
  const canUseHeroPower = isMyTurn && !uiState.heroAbilityUsed && 
    uiState.capital >= (HERO_ABILITY_COSTS[uiState.hero] || 2)
  
  const heroPowerInfo = HERO_POWER_INFO[uiState.hero] || { 
    name: 'Hero Power', 
    description: 'Use your hero\'s special ability' 
  }

  // Automatic cha-ching sound when revenue increases
  useEffect(() => {
    if (uiState.revenue > lastPlayerRevenue && lastPlayerRevenue > 0) {
      try {
        const audio = new Audio('/sounds/cha_ching_sound.mp3')
        audio.volume = 0.7
        audio.play().catch(() => {})
      } catch {
        // Ignore audio errors
      }
    }
    setLastPlayerRevenue(uiState.revenue)
  }, [uiState.revenue, lastPlayerRevenue])

  // Handle delayed midnight oil discard
  useEffect(() => {
    if (effectContext.midnightOilDiscardPending && isMyTurn) {
      const timer = setTimeout(() => {
        moves.triggerMidnightOilDiscard?.()
        setGameLog(prev => [`Ready to discard...`, ...prev.slice(0, 4)])
      }, 1500)
      
      setGameLog(prev => [`Drew 3 cards from Midnight Oil!`, ...prev.slice(0, 4)])
      
      return () => clearTimeout(timer)
    }
  }, [effectContext.midnightOilDiscardPending, isMyTurn, moves])

  // Handle delayed fast pivot destroy choice
  useEffect(() => {
    if (effectContext.fastPivotProductDestroyPending && isMyTurn) {
      moves.triggerFastPivotDestroyChoice?.()
      setGameLog(prev => [`Choose a Product to destroy...`, ...prev.slice(0, 4)])
    }
  }, [effectContext.fastPivotProductDestroyPending, isMyTurn, moves])

  // Game action handlers
  const handlePlayCard = useCallback((cardIndex: number) => {
    if (!isMyTurn) return
    hideCardTooltip()
    const card = uiState.hand[cardIndex]
    setGameLog(prev => [`Playing ${card?.name}...`, ...prev.slice(0, 4)])
    moves.playCard?.(cardIndex)
  }, [moves, uiState.hand, isMyTurn, hideCardTooltip])

  const handleEndTurn = useCallback(() => {
    if (isMyTurn && events?.endTurn) {
      hideCardTooltip()
      hideHeroPowerTooltip()
      setGameLog(prev => ['Ending turn...', ...prev.slice(0, 4)])
      events.endTurn()
    }
  }, [events, isMyTurn, hideCardTooltip, hideHeroPowerTooltip])

  const handleUseHeroPower = useCallback(() => {
    if (!canUseHeroPower) return
    hideHeroPowerTooltip()
    
    const hasProductsToBoost = uiState.hero === 'brand_builder' && uiState.products.length > 0
    const hasProductsToRefresh = uiState.hero === 'serial_founder' && 
      uiState.products.some(p => !p.isActive && p.inventory !== undefined && p.inventory > 0)
    
    if (hasProductsToBoost || hasProductsToRefresh) {
      moves.useHeroAbility?.(uiState.hero)
    } else {
      setGameLog(prev => [`Using ${heroPowerInfo.name}...`, ...prev.slice(0, 4)])
      moves.useHeroAbility?.(uiState.hero)
    }
  }, [moves, uiState.hero, uiState.products, heroPowerInfo.name, canUseHeroPower, hideHeroPowerTooltip])

  const handleMakeChoice = useCallback((choiceIndex: number) => {
    if (!isMyTurn || !uiState.pendingChoice) return
    hideCardTooltip()
    
    if (uiState.pendingChoice.type === 'discard') {
      const discardedCard = uiState.hand[choiceIndex]
      setGameLog(prev => [`Discarding ${discardedCard?.name}...`, ...prev.slice(0, 4)])
    } else if (uiState.pendingChoice.type === 'destroy_product') {
      const destroyedProduct = uiState.pendingChoice.cards?.[choiceIndex]
      setGameLog(prev => [`Destroying ${destroyedProduct?.name}...`, ...prev.slice(0, 4)])
    } else {
      const chosenCard = uiState.pendingChoice.cards?.[choiceIndex]
      const effectName = uiState.pendingChoice.effect?.replace(/_/g, ' ') || 'inventory effect'
      setGameLog(prev => [`Applying ${effectName} to ${chosenCard?.name || 'product'}...`, ...prev.slice(0, 4)])
    }
    
    moves.makeChoice?.(choiceIndex)
  }, [moves, uiState.hand, uiState.pendingChoice, isMyTurn, hideCardTooltip])

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
      <CardTooltip {...cardTooltip} />
      <HeroPowerTooltip 
        {...heroPowerTooltip} 
        heroPowerName={heroPowerInfo.name}
        heroPowerDescription={heroPowerInfo.description}
        cost={HERO_ABILITY_COSTS[uiState.hero] || 2}
      />

      {/* Header */}
      <GameHeader 
        heroName={uiState.hero}
        capital={uiState.capital}
        turn={uiState.turn}
        deckSize={uiState.deck.length}
        revenue={uiState.revenue}
      />

      {/* Main Game Area */}
      <div style={{ display: 'flex', flex: 1, gap: '20px' }}>
        
        {/* Left - Hero and Controls */}
        <HeroControls
          heroName={uiState.hero}
          heroCost={HERO_ABILITY_COSTS[uiState.hero] || 2}
          isHeroPowerUsed={uiState.heroAbilityUsed}
          canUseHeroPower={canUseHeroPower}
          isMyTurn={isMyTurn}
          gameLog={gameLog}
          soldProductThisTurn={effectContext.soldProductThisTurn}
          itemsSoldThisTurn={effectContext.itemsSoldThisTurn}
          onUseHeroPower={handleUseHeroPower}
          onEndTurn={handleEndTurn}
          onHeroPowerMouseEnter={showHeroPowerTooltip}
          onHeroPowerMouseLeave={hideHeroPowerTooltip}
          onHeroPowerMouseMove={showHeroPowerTooltip}
        />

        {/* Center - Game Board */}
        <div style={{
          flex: 1,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Tools & Employees */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: FONT_SIZES.subheading }}>Your Tools & Employees ({toolsAndEmployees.length})</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {toolsAndEmployees.length === 0 ? (
                <div style={{ 
                  padding: '20px', 
                  border: '2px dashed #666', 
                  borderRadius: '5px',
                  color: '#999',
                  fontSize: FONT_SIZES.body
                }}>
                  No tools or employees
                </div>
              ) : (
                toolsAndEmployees.map((card, i) => (
                  <div 
                    key={`${card.id || 'tool-employee'}-${i}`}
                    style={{
                      ...CARD_STYLES,
                      background: card.type === 'Employee' ? '#2563eb' : '#7c3aed',
                      border: card.type === 'Employee' ? '1px solid #3b82f6' : '1px solid #8b5cf6'
                    }}
                    onMouseEnter={(e) => showCardTooltip(card, e)}
                    onMouseLeave={hideCardTooltip}
                    onMouseMove={(e) => showCardTooltip(card, e)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'white', fontSize: FONT_SIZES.medium }}>{card.name}</div>
                    <div style={{ fontSize: FONT_SIZES.body, marginBottom: '3px', color: '#e2e8f0' }}>Cost: {card.cost}</div>
                    <div style={{ fontSize: FONT_SIZES.small, color: '#a78bfa' }}>{card.type}</div>
                    {card.isActive !== undefined && (
                      <div style={{ 
                        fontSize: FONT_SIZES.medium, 
                        color: card.isActive ? '#10b981' : '#6b7280',
                        fontWeight: 'bold'
                      }}>
                        {card.isActive ? 'Active' : 'Inactive'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Products */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: FONT_SIZES.subheading }}>
              Your Products ({uiState.products.length})
              {uiState.pendingChoice?.type === 'destroy_product' && (
                <span style={{ 
                  color: '#ef4444', 
                  marginLeft: '10px',
                  fontSize: FONT_SIZES.body 
                }}>
                  - Click a product to destroy it
                </span>
              )}
              {uiState.pendingChoice?.type === 'choose_card' && (
                <span style={{ 
                  color: '#10b981', 
                  marginLeft: '10px',
                  fontSize: FONT_SIZES.body 
                }}>
                  - Click a product to boost its inventory
                </span>
              )}
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {uiState.products.length === 0 ? (
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
                uiState.products.map((product, i) => {
                  const isDestroyMode = uiState.pendingChoice?.type === 'destroy_product'
                  const canDestroy = isDestroyMode && uiState.pendingChoice?.cards?.some(c => c.id === product.id)
                  
                  const isChooseMode = uiState.pendingChoice?.type === 'choose_card'
                  const canChoose = isChooseMode && uiState.pendingChoice?.cards?.some(c => c.id === product.id)
                  
                  const isClickable = canDestroy || canChoose
                  
                  return (
                    <div 
                      key={i} 
                      style={{
                        ...CARD_STYLES,
                        background: 
                          (isDestroyMode && canDestroy) ? '#dc2626' : 
                          (isChooseMode && canChoose) ? '#059669' :
                          '#065f46',
                        border: 
                          (isDestroyMode && canDestroy) ? '2px solid #ef4444' : 
                          (isChooseMode && canChoose) ? '2px solid #10b981' :
                          '1px solid #059669',
                        cursor: isClickable ? 'pointer' : 'default',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => showCardTooltip(product, e)}
                      onMouseLeave={hideCardTooltip}
                      onMouseMove={(e) => showCardTooltip(product, e)}
                      onClick={() => {
                        if (isClickable && uiState.pendingChoice?.cards) {
                          const choiceIndex = uiState.pendingChoice.cards.findIndex(c => c.id === product.id)
                          if (choiceIndex >= 0) {
                            handleMakeChoice(choiceIndex)
                          }
                        }
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: FONT_SIZES.medium }}>{product.name}</div>
                      <div style={{ fontSize: FONT_SIZES.body, marginBottom: '3px' }}>Cost: {product.cost}</div>
                      {product.inventory !== undefined && (
                        <div style={{ fontSize: FONT_SIZES.body, marginBottom: '8px' }}>Stock: {product.inventory}</div>
                      )}
                      
                      {isDestroyMode && canDestroy && (
                        <div style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#fbbf24',
                          color: '#000',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          DESTROY
                        </div>
                      )}
                      
                      {isChooseMode && canChoose && (
                        <div style={{
                          position: 'absolute',
                          bottom: '5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#10b981',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          BOOST
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Hand */}
          <PlayerHand
            hand={uiState.hand}
            pendingChoiceType={uiState.pendingChoice?.type}
            midnightOilPending={effectContext.midnightOilDiscardPending}
            getCostInfo={getCostInfo}
            capital={uiState.capital}
            isMyTurn={isMyTurn}
            effectContext={effectContext}
            onPlayCard={handlePlayCard}
            onMakeChoice={handleMakeChoice}
            onShowTooltip={showCardTooltip}
            onHideTooltip={hideCardTooltip}
          />
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel gameState={G as GameState} playerID={playerID} />
    </div>
  )
} 