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
import type { ClientCard, PendingChoice as ClientPendingChoice, EffectContextUI as ClientEffectContextUI } from '../../../types/game'
import { HeroDisplay } from './HeroDisplay'
import { ChoiceModal } from './ChoiceModal'

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
  const [affectedCardIds, setAffectedCardIds] = useState<Set<string>>(new Set());

  // Use custom hooks
  const { uiState, effectContext, toolsAndEmployees } = useGameState(G, playerID) as {
    uiState: import('../../../types/game').GameUIState;
    effectContext: ClientEffectContextUI;  // Use aliased client type
    toolsAndEmployees: ClientCard[];
  };
  const pendingChoice = uiState.pendingChoice as ClientPendingChoice | undefined; // Cast to client type
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

  useEffect(() => {
    // console.log('[GameScreen] useEffect for recentlyAffectedCardIds triggered. Current effectContext.recentlyAffectedCardIds:', effectContext.recentlyAffectedCardIds);
    // console.log('[GameScreen] Current local affectedCardIds (before processing):', Array.from(affectedCardIds));

    if (effectContext.recentlyAffectedCardIds && effectContext.recentlyAffectedCardIds.length > 0) {
      const newAffected = new Set(affectedCardIds);
      let newIdsAdded = false;
      effectContext.recentlyAffectedCardIds.forEach(id => {
        if (id && !newAffected.has(id)) { // Ensure id is not null/undefined
          newAffected.add(id);
          newIdsAdded = true;
          // console.log(`[GameScreen] Adding ${id} to local affectedCardIds. Setting timeout.`);
          setTimeout(() => {
            setAffectedCardIds(prev => {
              const updated = new Set(prev);
              updated.delete(id);
              // console.log(`[GameScreen] Timeout: Removed ${id} from local affectedCardIds. Now:`, Array.from(updated));
              return updated;
            });
          }, 1500);
        }
      });
      if (newIdsAdded) {
        // console.log('[GameScreen] Setting updated local affectedCardIds:', Array.from(newAffected));
        setAffectedCardIds(newAffected);
      }
      // Clear the game state's recentlyAffectedCardIds after processing to prevent re-triggering on unrelated re-renders
      // This needs a game move or a different pattern to be truly clean.
      // For now, this effect will re-run if the object reference changes but content is same.
      // A more robust solution might be for the game logic to set it to null after one read, or use a version counter.
    } else {
      // console.log('[GameScreen] useEffect for recentlyAffectedCardIds: No new IDs or empty list.');
    }
  }, [effectContext.recentlyAffectedCardIds, affectedCardIds]); // Added affectedCardIds to dependency to re-evaluate if it changes externally (though it shouldn't much)

  // Game action handlers
  const handlePlayCard = useCallback((cardIndex: number) => {
    if (!isMyTurn) return
    hideCardTooltip()
    const card = uiState.hand[cardIndex]

    // Add specific messages for cards with delayed effects
    if (card?.effect === 'delayed_inventory_boost') {
      setGameLog(prev => [`Playing ${card?.name} - Will add inventory for 2 turns!`, ...prev.slice(0, 4)])
    } else {
      setGameLog(prev => [`Playing ${card?.name}...`, ...prev.slice(0, 4)])
    }

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
    if (!isMyTurn || !pendingChoice) return;
    hideCardTooltip(); 
    hideHeroPowerTooltip();

    // Log based on choice type and effect before sending move
    if (pendingChoice.type === 'discard') {
      const cardToDiscard = uiState.hand[choiceIndex]; 
      setGameLog(prev => [`Discarding ${cardToDiscard?.name || 'card'}...`, ...prev.slice(0, 4)]);
    } else if (pendingChoice.type === 'destroy_product') {
      const productToDestroy = pendingChoice.cards?.[choiceIndex];
      setGameLog(prev => [`Destroying ${productToDestroy?.name || 'product'}...`, ...prev.slice(0, 4)]);
    } else if (pendingChoice.type === 'choose_card' && pendingChoice.cards) {
      const chosenCard = pendingChoice.cards[choiceIndex];
      const effectName = pendingChoice.effect?.replace(/_/g, ' ') || 'effect';
      setGameLog(prev => [`Applying ${effectName} to ${chosenCard?.name || 'card'}...`, ...prev.slice(0, 4)]);
    } else if (pendingChoice.type === 'choose_option' && pendingChoice.options) {
      // Use choice.options[choiceIndex] for logging the chosen option text
      setGameLog(prev => [`Chose option: "${pendingChoice.options?.[choiceIndex]}" for ${pendingChoice.effect}`, ...prev.slice(0,4)]);
    } else if (pendingChoice.type === 'view_deck_and_discard' && pendingChoice.cards) {
      if (choiceIndex >=0 && choiceIndex < pendingChoice.cards.length) {
        setGameLog(prev => [`Opted to discard ${pendingChoice.cards?.[choiceIndex]?.name} from deck view.`, ...prev.slice(0,4)]);
      } else {
        setGameLog(prev => [`Opted to keep cards from deck view.`, ...prev.slice(0,4)]);
      }
    } else if (pendingChoice.type === 'choose_from_drawn_to_discard' && pendingChoice.cards) {
       setGameLog(prev => [`Opted to discard ${pendingChoice.cards?.[choiceIndex]?.name} from A/B Test draw.`, ...prev.slice(0,4)]);
    }
    
    moves.makeChoice?.(choiceIndex);
  }, [moves, uiState.hand, pendingChoice, isMyTurn, hideCardTooltip, hideHeroPowerTooltip]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at top, #3b2a4f, #1a1a2e 70%)',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", "ShopifySans", "Helvetica Neue", "sans-serif"'
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
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
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
      <div style={{ display: 'flex', flex: 1, gap: '20px' }}>

        {/* Left - Controls and Game Log */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '250px', gap: '20px' }}>
        <HeroControls
          isMyTurn={isMyTurn}
          gameLog={gameLog}
          soldProductThisTurn={effectContext.soldProductThisTurn}
          itemsSoldThisTurn={effectContext.itemsSoldThisTurn}
        />
        </div>

        {/* Center - Game Board */}
        <div style={{
          flex: 1,
          background: 'rgba(40, 30, 60, 0.5)',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(120, 80, 190, 0.7)',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
        }}>
          {/* Tools & Employees */}
          <ToolsAndEmployees
            cards={toolsAndEmployees}
            effectContext={effectContext}
            onShowTooltip={showCardTooltip}
            onHideTooltip={hideCardTooltip}
            affectedCardIds={affectedCardIds}
          />

          {/* Products */}
          <ProductsSection
            products={uiState.products}
            pendingChoice={pendingChoice}
            effectContext={effectContext}
            onMakeChoice={handleMakeChoice}
            onShowTooltip={showCardTooltip}
            onHideTooltip={hideCardTooltip}
            affectedCardIds={affectedCardIds}
          />
        </div>
      </div>

      {/* Bottom Row - Hero Display and Hand */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px' }}>
        {/* Hero Display - Bottom Left */}
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

        {/* Player Hand - Centered at Bottom */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <PlayerHand
          hand={uiState.hand}
          pendingChoiceType={pendingChoice?.type}
          midnightOilPending={effectContext.midnightOilDiscardPending}
          getCostInfo={getCostInfo}
          capital={uiState.capital}
          isMyTurn={isMyTurn}
          effectContext={effectContext}
          affectedCardIds={affectedCardIds}
          onPlayCard={handlePlayCard}
          onMakeChoice={handleMakeChoice}
          onShowTooltip={showCardTooltip}
          onHideTooltip={hideCardTooltip}
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

      {/* Debug Panel */}
      <DebugPanel gameState={G as GameState} playerID={playerID} />

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
