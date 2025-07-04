# TODO List - Dream Builders Card Game

This file tracks unimplemented features, card effects, and mechanics.

## I. UI & UX Enhancements

- **Advanced Player Choice UI**: 
    - UI for Custom App modal play choice.
    - UI for Incubator Resources option choice.
    // Multi-selection (e.g., Warehouse Expansion - current implementation is sequential single picks) - Needs UI to show X of Y selected if choice persists across clicks.
- **Tooltips**: Review all tooltips for clarity and completeness, especially for cards with complex or unimplemented effects.
- **Visual Feedback**: 
    - Enhance for other game states or effects (e.g., when a choice is pending generally).
- **Big Card Viewer**: 
    - Implement a full-screen or large overlay card viewer to showcase card artwork
    - Should be triggered by right-click or specific key/button on cards
    - Display high-resolution card art, full effect text, and flavor text
    - Include smooth animations for opening/closing the viewer

## II. Code & System Improvements

- **Deck Building/Drafting Mode**: Implement a pre-game drafting phase where players can customize their deck composition by choosing which cards to include from available pools.
- **Multiplayer Support**: Adapt game logic and UI for multiplayer (if planned).
- **Card Balance**: Comprehensive playtesting and balancing of card costs, effects, and hero powers.
- **Test Coverage**: Implement unit and integration tests.
- **Styling**: Refactor inline styles to a more maintainable system (e.g., Tailwind CSS, CSS Modules).
- **`cardEffects.ts` Linter Issues**: Manually ensure `cardEffects.ts` is correctly refactored by removing all local helper function definitions and ensuring all callsites use imported helpers to resolve persistent linter errors. 


## III. Real World opponent
- // TASK: Implement "The Real World" opponent deck for the single-player game mode.

// CONTEXT:
// The Real World is an AI opponent that plays disruptive setback-style cards
// to challenge the merchant player. These include:
// - One-time effects (e.g., destroying cards, reducing revenue)
// - Ongoing effects (lasting 2-3 turns)
// - Boss Events (rare, powerful effects that add urgency and narrative drama)

// GOAL:
// - Create a new file: `realWorldDeck.ts`
// - Export an array of 15 cards with the following structure:

type RealWorldCard = {
  id: string;
  name: string;
  type: 'OneTime' | 'Ongoing' | 'Chaos' | 'BossEvent';
  text: string;           // Card rules effect (succinct but clear)
  flavor: string;         // Short flavor quote (escaped single quotes only)
  duration?: number;      // Optional, for ongoing effects
};

export const realWorldDeck: RealWorldCard[] = [ ... ]; // Add all 15 cards below

// CARDS TO INCLUDE:
// 1. Surprise Chargeback
// 2. Supplier Delay
// 3. Negative Review
// 4. Unexpected Tax Bill
// 5. Platform Algorithm Change
// 6. Economic Slowdown
// 7. Shipping Crisis
// 8. Platform Policy Update
// 9. Tech Glitch
// 10. Trend Whiplash
// 11. Black Friday Blowout
// 12. Holiday Returns Avalanche
// 13. Factory Audit
// 14. Supply Chain Meltdown
// 15. Global Event Disruption

// See design notes and balance suggestions from the conversation for effect logic.

- realWorldDeck.ts
export type RealWorldCard = {
  id: string;
  name: string;
  type: 'OneTime' | 'Ongoing' | 'Chaos' | 'BossEvent';
  text: string;
  flavor: string;
  duration?: number;
};

export const realWorldDeck: RealWorldCard[] = [
  {
    id: 'surprise_chargeback',
    name: 'Surprise Chargeback',
    type: 'OneTime',
    text: 'Remove 1 product card from your board.',
    flavor: 'The customer changed their mind... and their payment.'
  },
  {
    id: 'supplier_delay',
    name: 'Supplier Delay',
    type: 'Ongoing',
    text: 'Reduce all product inventory by 1 for 2 turns.',
    flavor: 'Waiting is the new hustle.',
    duration: 2
  },
  {
    id: 'negative_review',
    name: 'Negative Review',
    type: 'OneTime',
    text: 'Decrease revenue of all product cards by 20% this turn.',
    flavor: 'One star can sting more than a thousand likes.'
  },
  {
    id: 'unexpected_tax_bill',
    name: 'Unexpected Tax Bill',
    type: 'OneTime',
    text: 'Lose 2 inventory on one product card of your choice.',
    flavor: 'The taxman always rings twice.'
  },
  {
    id: 'platform_algorithm_change',
    name: 'Platform Algorithm Change',
    type: 'Ongoing',
    text: 'Draw 1 fewer card each turn for 3 turns.',
    flavor: 'The rules changed, but your hustle didn\'t.',
    duration: 3
  },
  {
    id: 'economic_slowdown',
    name: 'Economic Slowdown',
    type: 'Ongoing',
    text: 'All revenue reduced by 30% for 3 turns.',
    flavor: 'The market caught a cold.',
    duration: 3
  },
  {
    id: 'shipping_crisis',
    name: 'Shipping Crisis',
    type: 'OneTime',
    text: 'No new inventory can be added next turn.',
    flavor: 'Packages on pause, patience in play.'
  },
  {
    id: 'platform_policy_update',
    name: 'Platform Policy Update',
    type: 'OneTime',
    text: 'Discard one product card at random.',
    flavor: 'New rules, new headaches.'
  },
  {
    id: 'tech_glitch',
    name: 'Tech Glitch',
    type: 'Chaos',
    text: 'Randomly shuffle your product cards and lose 1 inventory on each.',
    flavor: 'When the system crashes, so does your day.'
  },
  {
    id: 'trend_whiplash',
    name: 'Trend Whiplash',
    type: 'OneTime',
    text: 'Choose one product card: lose all revenue for this turn.',
    flavor: 'Yesterday\'s hit, today\'s miss.'
  },
  {
    id: 'black_friday_blowout',
    name: 'Black Friday Blowout',
    type: 'BossEvent',
    text: 'All inventory halved, but revenue doubled this turn.',
    flavor: 'The chaos you both fear and love.'
  },
  {
    id: 'holiday_returns_avalanche',
    name: 'Holiday Returns Avalanche',
    type: 'BossEvent',
    text: 'Lose half your total inventory over 2 turns.',
    flavor: 'The season after the season brings its own storms.',
    duration: 2
  },
  {
    id: 'factory_audit',
    name: 'Factory Audit',
    type: 'OneTime',
    text: 'Temporarily disable one product card for 2 turns.',
    flavor: 'Quality checks or quality wrecks?',
    duration: 2
  },
  {
    id: 'supply_chain_meltdown',
    name: 'Supply Chain Meltdown',
    type: 'Ongoing',
    text: 'No new products can be added for 3 turns.',
    flavor: 'When the chain breaks, so does your rhythm.',
    duration: 3
  },
  {
    id: 'global_event_disruption',
    name: 'Global Event Disruption',
    type: 'BossEvent',
    text: 'All revenue cut in half and no inventory added for 3 turns.',
    flavor: 'When the world stops, so does the sale.',
    duration: 3
  }
];
