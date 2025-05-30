import type { GameState } from '../../game/state'
import type { GameUIState, EffectContextUI, ClientCard } from '../types/game'

export function useGameState(
  gameState: unknown,
  playerID: string
): { uiState: GameUIState; effectContext: EffectContextUI; toolsAndEmployees: ClientCard[] } {
  const G = gameState as GameState
  const players = G.players as Record<string, unknown>
  const currentPlayer = players[playerID] as Record<string, unknown>
  
  // Extract cards
  const hand = Array.isArray(currentPlayer.hand) ? currentPlayer.hand as ClientCard[] : []
  const deck = Array.isArray(currentPlayer.deck) ? currentPlayer.deck as ClientCard[] : []
  const board = currentPlayer.board as Record<string, ClientCard[]>
  const products = Array.isArray(board?.Products) ? board.Products : []
  const tools = Array.isArray(board?.Tools) ? board.Tools : []
  const employees = Array.isArray(board?.Employees) ? board.Employees : []
  
  // Combined array for display
  const toolsAndEmployees = [...tools, ...employees]
  
  // Extract effect context
  const effectContextRaw = (G.effectContext as Record<string, Record<string, unknown>>)?.[playerID] || {}
  
  const effectContext: EffectContextUI = {
    itemsSoldThisTurn: effectContextRaw.itemsSoldThisTurn as number || 0,
    soldProductThisTurn: effectContextRaw.soldProductThisTurn as boolean || false,
    midnightOilDiscardPending: effectContextRaw.midnightOilDiscardPending as boolean || false,
    fastPivotProductDestroyPending: effectContextRaw.fastPivotProductDestroyPending as boolean || false,
    nextCardDiscount: effectContextRaw.nextCardDiscount as number | undefined,
    productCostReduction: effectContextRaw.productCostReduction as number | undefined,
    cardsPlayedThisTurn: effectContextRaw.cardsPlayedThisTurn as number | undefined,
    lastActionEffect: effectContextRaw.lastActionEffect as string | undefined,
    lastActionCard: effectContextRaw.lastActionCard as ClientCard | undefined,
    productRevenueBoosts: effectContextRaw.productRevenueBoosts as Record<string, number> | undefined,
    delayedInventoryBoostTurns: effectContextRaw.delayedInventoryBoostTurns as number | undefined,
    soloHustlerDiscountedCard: effectContextRaw.soloHustlerDiscountedCard as string | undefined,
  }
  
  // Extract pending choice
  const pendingChoice = (currentPlayer as Record<string, unknown>).pendingChoice as {
    type: string;
    effect: string;
    cards?: ClientCard[];
    cardIndices?: number[];
  } | undefined
  
  const uiState: GameUIState = {
    hand,
    deck,
    products,
    tools,
    employees,
    capital: Number(currentPlayer.capital || 0),
    revenue: Number(currentPlayer.revenue || 0),
    hero: String(currentPlayer.hero || 'Unknown'),
    heroAbilityUsed: Boolean(currentPlayer.heroAbilityUsed),
    pendingChoice,
    turn: Number(G.turn || 1),
  }
  
  return {
    uiState,
    effectContext,
    toolsAndEmployees,
  }
} 