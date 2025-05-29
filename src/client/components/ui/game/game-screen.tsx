"use client"

import { useState, useEffect, useCallback } from "react"
import { DebugPanel } from '../DebugPanel'
import { CardTooltip } from './CardTooltip'
import { HeroPowerTooltip } from './HeroPowerTooltip'
import { GameHeader } from './GameHeader'
import { HeroControls } from './HeroControls'
import { PlayerHand } from './PlayerHand'
import { ProductsSection } from './ProductsSection'
import { ToolsAndEmployees } from './ToolsAndEmployees'
import { useGameState } from '../../../hooks/useGameState'
import { useTooltip } from '../../../hooks/useTooltip'
import { useCardDiscount } from '../../../hooks/useCardDiscount'
import { allHeroes } from '../../../../game/data/heroes'
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

  // Get hero data from the single source of truth
  const currentHero = allHeroes.find(h => h.id === uiState.hero)
  const heroPowerCost = currentHero?.heroPower.cost || 2
  const heroPowerInfo = currentHero?.heroPower || { 
    name: 'Hero Power', 
    description: 'Use your hero\'s special ability' 
  }

  // Extract derived state
  const canUseHeroPower = isMyTurn && !uiState.heroAbilityUsed && 
    uiState.capital >= heroPowerCost

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
        cost={heroPowerCost}
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
          heroCost={heroPowerCost}
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
          <ToolsAndEmployees
            cards={toolsAndEmployees}
            onShowTooltip={showCardTooltip}
            onHideTooltip={hideCardTooltip}
          />
          
          {/* Products */}
          <ProductsSection
            products={uiState.products}
            pendingChoice={uiState.pendingChoice}
            onMakeChoice={handleMakeChoice}
            onShowTooltip={showCardTooltip}
            onHideTooltip={hideCardTooltip}
          />

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