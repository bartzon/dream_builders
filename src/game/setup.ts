import type { GameState, Card } from './types';
import { marketerHero, developerHero, operatorHero, visionaryHero } from '../game/data/heroes';

// Helper to shuffle array
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper function to create a 30-card deck from a 10-card starter deck
function createFullDeck(starterDeck: Card[]): Card[] {
  const fullDeck: Card[] = [];
  const maxCopiesPerCard = 4;
  const targetDeckSize = 30;
  
  // First, add 3 copies of each card (10 * 3 = 30)
  for (const card of starterDeck) {
    for (let i = 0; i < 3; i++) {
      fullDeck.push({ ...card });
    }
  }
  
  // If we need more cards to reach 30, add additional copies
  while (fullDeck.length < targetDeckSize) {
    for (const card of starterDeck) {
      if (fullDeck.length >= targetDeckSize) break;
      
      // Count how many copies of this card we already have
      const copiesInDeck = fullDeck.filter(c => c.id === card.id).length;
      
      if (copiesInDeck < maxCopiesPerCard) {
        fullDeck.push({ ...card });
      }
    }
  }
  
  return fullDeck;
}

export function setupGame(numPlayers: number): GameState {
  const players: GameState['players'] = {};
  const heroes = [marketerHero, developerHero, operatorHero, visionaryHero];
  
  // Initialize players with hero classes
  for (let i = 0; i < numPlayers; i++) {
    const heroClass = heroes[i % heroes.length];
    const fullDeck = createFullDeck(heroClass.starterDeck);
    const deck = shuffle(fullDeck);
    const hand: Card[] = [];
    
    // Draw initial hand of 3 cards
    for (let j = 0; j < 3; j++) {
      const card = deck.pop();
      if (card) hand.push(card);
    }
    
    players[i.toString()] = {
      capital: 0,
      deck,
      hand,
      field: [],
      usedHeroAbility: false,
      heroClass
    };
  }
  
  return {
    players,
    teamRevenue: 0,
    turnOrder: Array.from({ length: numPlayers }, (_, i) => i.toString()),
    currentPlayerIndex: 0
  };
} 