import type { GameState } from '../../state';
import type { Card } from '../../types'; // Card type will be needed for player.deck type checking

export function handleAutomationArchitectPassives(G: GameState, playerID: string): void {
  const player = G.players[playerID];

  // Auto Fulfill - gain 1 capital if you sold a Product last turn
  const autoFulfill = player.board.Tools.find(t => t.effect === 'auto_fulfill');
  if (autoFulfill && G.effectContext?.[playerID]?.soldProductLastTurn) {
    player.capital = Math.min(10, player.capital + 1);
  }

  // Basic Script - gain 1 capital each turn
  const basicScript = player.board.Tools.find(t => t.effect === 'basic_script');
  if (basicScript) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Email Automation - gain 1 capital each turn
  const emailAutomation = player.board.Tools.find(t => t.effect === 'email_automation');
  if (emailAutomation) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Scale Systems - gain 1 capital each turn
  const scaleSystems = player.board.Tools.find(t => t.effect === 'scale_systems');
  if (scaleSystems) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Custom App - gain 1 capital each turn (recurring effect)
  const customApp = player.board.Tools.find(t => t.effect === 'custom_app');
  if (customApp) {
    player.capital = Math.min(10, player.capital + 1);
  }
  
  // Analytics Dashboard - view top 2, optionally discard 1
  const analyticsDashboard = player.board.Tools.find(t => t.effect === 'analytics_dashboard');
  if (analyticsDashboard && player.deck.length > 0 && !player.pendingChoice) { // Ensure no other choice is active
    const cardsToView = player.deck.slice(-2).reverse(); 
    player.pendingChoice = {
      type: 'view_deck_and_discard',
      effect: 'analytics_dashboard_discard',
      cards: cardsToView.map(c => ({ ...c } as Card)), // Ensure cards are of type Card
      count: cardsToView.length, 
      sourceCard: { ...analyticsDashboard } // Pass a copy of the source card
    };
  }
  
  // Machine Learning Model - gain capital equal to number of Tools
  const mlModel = player.board.Tools.find(t => t.effect === 'ml_model');
  if (mlModel) {
    const toolCount = player.board.Tools.length;
    player.capital = Math.min(10, player.capital + toolCount);
  }

  // Server Farm (Product, but acts like a passive income source here)
  const serverFarm = player.board.Products.find(p => p.effect === 'server_farm');
  if (serverFarm) {
    player.revenue += 10000;
  }
} 