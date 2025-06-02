"use client"

import { useState, useEffect, useCallback } from "react"
import { HeroPowerTooltip } from './HeroPowerTooltip'
import { GameHeader } from './GameHeader'
import { PlayerHand } from './PlayerHand'
import { ProductsSection } from './ProductsSection'
import { ToolsAndEmployees } from './ToolsAndEmployees'
import { useGameState } from '../../../hooks/useGameState'
import { useTooltip } from '../../../hooks/useTooltip'
import { useCardDiscount } from '../../../hooks/useCardDiscount'
import { allHeroes } from '../../../../game/data/heroes'
import type { GameState } from '../../../../game/state'
import type { PendingChoice as ClientPendingChoice } from '../../../types/game'
import { HeroDisplay } from './HeroDisplay'
import { ChoiceModal } from './ChoiceModal'
import { GameLog } from './GameLog'
import { GameOverModal } from './GameOverModal'
import { BUTTON_STYLES, FONT_SIZES } from "../../../constants/ui"
import { heroPowerRequirementsMet } from '../../../utils/heroPowerHelpers'

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
  const [showGameLog, setShowGameLog] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [lastPlayerRevenue, setLastPlayerRevenue] = useState(0)
  const [affectedCardIds, setAffectedCardIds] = useState<Set<string>>(new Set());

  // Debug logging
  console.log('Game State:', G);
  console.log('Game Log:', (G as GameState).gameLog);

  // Use custom hooks
  const { uiState, effectContext, toolsAndEmployees } = useGameState(G, playerID)
  
  // Get the current pending choice (first in queue)
  const pendingChoice = uiState.pendingChoices[0] as ClientPendingChoice | undefined
  
  const {
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
    uiState.capital >= heroPowerCost && heroPowerRequirementsMet(uiState.hero, uiState.products)

  // Check for game over
  useEffect(() => {
    const gameState = G as GameState
    if (gameState.gameOver && !showGameOver) {
      setShowGameOver(true)
    }
  }, [G, showGameOver])

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
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [effectContext.midnightOilDiscardPending, isMyTurn, moves])

  // Handle delayed fast pivot destroy choice
  useEffect(() => {
    if (effectContext.fastPivotProductDestroyPending && isMyTurn) {
      moves.triggerFastPivotDestroyChoice?.()
    }
  }, [effectContext.fastPivotProductDestroyPending, isMyTurn, moves])

  useEffect(() => {
    if (effectContext.recentlyAffectedCardIds && effectContext.recentlyAffectedCardIds.length > 0) {
      const newAffected = new Set(affectedCardIds);
      let newIdsAdded = false;
      effectContext.recentlyAffectedCardIds.forEach(id => {
        if (id && !newAffected.has(id)) {
          newAffected.add(id);
          newIdsAdded = true;
          setTimeout(() => {
            setAffectedCardIds(prev => {
              const updated = new Set(prev);
              updated.delete(id);
              return updated;
            });
          }, 1500);
        }
      });
      if (newIdsAdded) {
        setAffectedCardIds(newAffected);
      }
    }
  }, [effectContext.recentlyAffectedCardIds, affectedCardIds]);

  // Handle sparkle animation for recently sold products
  useEffect(() => {
    if (effectContext.recentlySoldProductIds && effectContext.recentlySoldProductIds.length > 0) {
      // Play cash register sound once for all products sold
      try {
        const audio = new Audio('/sounds/cha_ching_sound.mp3')
        audio.volume = 0.5
        audio.play().catch(() => {})
      } catch {
        // Ignore audio errors
      }
      
      // Clear the recently sold products after the sparkle animation completes (2s)
      const timeout = setTimeout(() => {
        // We can't directly modify the game state here, but the effect will be cleared
        // at the end of the turn or when new products are sold
      }, 2000)
      
      return () => clearTimeout(timeout)
    }
  }, [effectContext.recentlySoldProductIds?.length]) // Only trigger when the length changes

  // Game action handlers
  const handlePlayCard = useCallback((cardIndex: number) => {
    if (!isMyTurn) return
    hideCardTooltip()

    moves.playCard?.(cardIndex)
  }, [moves, isMyTurn, hideCardTooltip])

  const handleEndTurn = useCallback(() => {
    if (isMyTurn && events?.endTurn) {
      hideCardTooltip()
      hideHeroPowerTooltip()
      events.endTurn()
    }
  }, [events, isMyTurn, hideCardTooltip, hideHeroPowerTooltip])

  const handleUseHeroPower = useCallback(() => {
    if (!canUseHeroPower) return
    hideHeroPowerTooltip()
    moves.useHeroAbility?.(uiState.hero)
  }, [moves, uiState.hero, canUseHeroPower, hideHeroPowerTooltip])

  const handleMakeChoice = useCallback((choiceIndex: number) => {
    if (!isMyTurn || !pendingChoice) return;
    hideCardTooltip();
    hideHeroPowerTooltip();

    moves.makeChoice?.(choiceIndex);
  }, [moves, pendingChoice, isMyTurn, hideCardTooltip, hideHeroPowerTooltip]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: `url('/src/assets/background.png') center/cover no-repeat, radial-gradient(ellipse at top, #3b2a4f, #1a1a2e 70%)`,
      color: 'white',
      padding: '20px',
      paddingBottom: '0', // Remove bottom padding since hand extends beyond
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      overflowX: 'hidden', // Prevent horizontal scrolling
      overflowY: 'hidden' // Keep vertical hidden
    }}>
      {/* Tooltips */}
      {/* <CardTooltip {...cardTooltip} /> */}
      <HeroPowerTooltip
        {...heroPowerTooltip}
        heroPowerName={heroPowerInfo.name}
        heroPowerDescription={heroPowerInfo.description}
        cost={heroPowerCost}
        heroId={uiState.hero}
        cardsPlayedThisTurn={effectContext.cardsPlayedThisTurn || 0}
      />

      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '15px',
        flexShrink: 0
      }}>
        <GameHeader
          heroName={uiState.hero}
          capital={uiState.capital}
          turn={uiState.turn}
          deckSize={uiState.deck.length}
          revenue={uiState.revenue}
          effectContext={effectContext}
          hasShoestringBudget={toolsAndEmployees.some(card => card.effect === 'shoestring_budget')}
        />
      </div>

      {/* Main Game Area */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        gap: '20px',
        minHeight: 0,
        maxHeight: 'calc(100vh - 280px)'
      }}>

        {/* Center - Game Board */}
        <div style={{
          flex: 1,
          background: 'rgba(40, 30, 60, 0.5)',
          borderRadius: '10px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
          border: '1px solid rgba(120, 80, 190, 0.7)',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {/* Tools & Employees - Left Side */}
          <div style={{ 
            flex: 1, 
            minWidth: 0,
            background: 'rgba(120, 80, 190, 0.1)', // Purple tint for tools/employees
            borderRadius: '8px',
            padding: '15px',
            minHeight: '280px', // Ensure space for at least 2 rows of cards
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ToolsAndEmployees
              cards={toolsAndEmployees}
              effectContext={effectContext}
              onShowTooltip={showCardTooltip}
              onHideTooltip={hideCardTooltip}
              affectedCardIds={affectedCardIds}
            />
          </div>

          {/* Divider */}
          <div style={{
            width: '1px',
            background: 'rgba(120, 80, 190, 0.3)',
            margin: '0 15px'
          }} />

          {/* Products - Right Side */}
          <div style={{ 
            flex: 1, 
            minWidth: 0,
            background: 'rgba(34, 197, 94, 0.1)', // Green tint for products
            borderRadius: '8px',
            padding: '15px',
            minHeight: '280px', // Ensure space for at least 2 rows of cards
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ProductsSection
              products={uiState.products}
              tools={uiState.tools}
              effectContext={effectContext}
              onShowTooltip={showCardTooltip}
              onHideTooltip={hideCardTooltip}
              affectedCardIds={affectedCardIds}
            />
          </div>
        </div>

      </div> {/* End of Main Game Area */}

      {/* Bottom Row - Hero Display and Hand */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', // Back to center
        width: '100%', 
        marginTop: '15px',
        flexShrink: 0,
        minHeight: '120px', // Keep reduced height
        position: 'relative',
        marginBottom: '-80px', // Pull content up by pushing container down
        paddingBottom: '80px', // Add padding to compensate
        overflow: 'visible' // Allow cards to pop up
      }}>
        {/* Hero Display - Bottom Left */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <HeroDisplay
            hero={currentHero}
            heroCost={heroPowerCost}
            isHeroPowerUsed={uiState.heroAbilityUsed}
            canUseHeroPower={canUseHeroPower}
            onUseHeroPower={handleUseHeroPower}
            onHeroPowerMouseEnter={showHeroPowerTooltip}
            onHeroPowerMouseLeave={hideHeroPowerTooltip}
            onHeroPowerMouseMove={showHeroPowerTooltip}
          />
          
          {/* Game Log Button */}
          <button
            onClick={() => setShowGameLog(true)}
            style={{
              ...BUTTON_STYLES,
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: 'white',
              padding: '8px 16px',
              fontSize: FONT_SIZES.small,
              borderRadius: '6px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '120px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)'
            }}
          >
            📜 Game Log
          </button>
        </div>

        {/* Player Hand - Centered at Bottom */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center',
          transform: 'translateY(80px)', // Push hand down
          zIndex: 100, // Increased from 10
          overflow: 'visible' // Allow cards to pop up
        }}>
        <PlayerHand
          hand={uiState.hand}
          getCostInfo={getCostInfo}
          capital={uiState.capital}
          isMyTurn={isMyTurn}
          effectContext={effectContext}
          affectedCardIds={affectedCardIds}
          onPlayCard={handlePlayCard}
          onShowTooltip={showCardTooltip}
          onHideTooltip={hideCardTooltip}
          isChoiceModalOpen={!!pendingChoice}
          products={uiState.products}
        />
        </div>

        {/* Empty div for spacing, to keep hand centered if hero display takes space */}
        <div style={{ width: '250px' }} />
      </div>

      <ChoiceModal
        pendingChoice={pendingChoice}
        onMakeChoice={handleMakeChoice}
        uiState={uiState}
      />

      {/* Game Log Popup */}
      <GameLog
        isOpen={showGameLog}
        onClose={() => setShowGameLog(false)}
        gameLog={(G as GameState).gameLog || []}
        gameState={G as GameState}
        playerID={playerID}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOver}
        isVictory={(G as GameState).winner}
        revenue={uiState.revenue}
        turn={uiState.turn}
        onNewGame={() => {
          // Refresh the page to start a new game
          window.location.reload()
        }}
        onContinue={() => {
          setShowGameOver(false)
        }}
      />

      {/* End Turn Button - Bottom Right */}
      {isMyTurn && (
        <button
          onClick={handleEndTurn}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            ...BUTTON_STYLES,
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px 24px',
            fontSize: FONT_SIZES.large, // Or an appropriate size
            zIndex: 1500, // Ensure it's above most other elements
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
        >
          End Turn
        </button>
      )}
    </div>
  )
}
