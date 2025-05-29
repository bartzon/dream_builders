import type { Card } from "./types";
import type { EffectContext } from "./logic/effectContext";

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
  hero: "Marketer" | "Developer" | "Operator" | "Visionary" | "Solo_hustler" | "Brand_builder" | "Automation_architect" | "Community_leader" | "Serial_founder";
  heroAbilityUsed: boolean;
}

export interface GameState {
  players: Record<string, PlayerState>;
  currentPlayer: string;
  turn: number;
  teamRevenue: number;
  teamExpenses?: number;
  marketPressure?: number;
  gameOver: boolean;
  winner: boolean;
  effectContext?: Record<string, EffectContext>;
} 