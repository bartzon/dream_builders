export type CardType = 'Product' | 'Tool' | 'Action' | 'Employee';

export type Keyword = 'Recurring' | 'Fulfill' | 'Overhead' | 'Automate' | 'Synergy';

export interface Card {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  keywords?: string[];
  text: string;
  effect?: string;
  flavor?: string;
  resilience?: number;
  synergyCondition?: string;
  inventory?: number;
  revenuePerSale?: number;
  isActive?: boolean;
  overheadCost?: number;
  appeal?: number;
}

export interface HeroClass {
  id: string;
  name: string;
  color: 'Red' | 'Blue' | 'Green' | 'Black' | 'White';
  starterDeck: Card[];
}

export interface PlayerState {
  capital: number;
  deck: Card[];
  hand: Card[];
  field: Card[];
  usedHeroAbility: boolean;
  heroClass: HeroClass;
}

export interface GameState {
  players: {
    [playerID: string]: PlayerState;
  };
  turnOrder: string[];
  currentPlayerIndex: number;
} 