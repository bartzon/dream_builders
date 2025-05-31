import type { Card } from "./types";
import type { EffectContext } from "./logic/effectContext";

export interface PendingChoice {
  type: 'discard' | 'choose_card' | 'choose_option' | 'destroy_product' | 'view_deck_and_discard' | 'choose_from_drawn_to_discard';
  cards?: Card[];
  options?: string[];
  cardIndices?: number[];
  effect: string;
  sourceCard?: Card;
  count?: number;
}

export interface PlayerState {
  hand: Card[];
  deck: Card[];
  board: {
    Tools: Card[];
    Products: Card[];
    Employees: Card[];
  };
  revenue: number;
  capital: number;
  hero: "Marketer" | "Developer" | "Operator" | "Visionary" | "solo_hustler" | "brand_builder" | "automation_architect" | "community_leader" | "serial_founder";
  heroAbilityUsed: boolean;
  pendingChoices: PendingChoice[];
}

export interface GameState {
  players: Record<string, PlayerState>;
  currentPlayer: string;
  turn: number;
  gameOver: boolean;
  winner: boolean;
  effectContext?: Record<string, EffectContext>;
  gameLog?: string[];
} 