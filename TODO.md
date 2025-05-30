# TODO List - Dream Builders Card Game

This file tracks unimplemented features, card effects, and mechanics.

## I. Major Missing Mechanics

### 1. Audience Mechanic
- **Status**: Not Implemented
- **Description**: A core resource/threshold mechanic, especially for Brand Builder and Community Leader heroes.
- **Required Changes**:
    - Add `audience: number` to `PlayerState`.
    - Implement game logic for gaining, spending, and checking Audience thresholds.
    - Update UI to display Audience.
- **Cards Affected (Examples - see full list in card data)**:
    - **Influencer Collab (Brand Builder)**: "Add 3 Audience. Gain 2 capital."
    - **Content Calendar (Brand Builder)**: "Recurring: Add 1 Audience at the start of your turn."
    - **Viral Post (Brand Builder)**: "Add 5 Audience. If you've gained Audience this turn, gain 2 capital."
    - **Email List (Brand Builder)**: "Recurring: If you have 5+ Audience, gain 1 capital."
    - **UGC Explosion (Brand Builder)**: "Double your Audience if you control a Product."
    - **Personal Branding (Brand Builder)**: "Whenever you play a Brand card, gain 1 Audience."
    - **Live AMA (Community Leader)**: "Draw 2 cards. Add 2 Audience."
    - **Merch Drop (Community Leader)**: "Costs 1 less if you have 5+ Audience. Sells for 3."
    - **Grassroots Launch (Community Leader)**: "Add 5 Audience. You may sell a Product."
    - **Tech Press Feature (Serial Founder)**: "Add 3 Audience. If you control a Product, add 5 instead."
    - **Hype Train (Community Leader)**: "Your team gets +1 capital whenever you gain Audience."
    - **Fanbase (Community Leader)**: "Recurring: Gain 1 Audience."

## II. Incomplete Card Effects & Hero Powers

### Brand Builder
- **Hero Power: Engage**
    - **Text**: "Give a Product +1 Appeal this turn."
    - **Status**: Currently boosts global appeal. Needs UI for player to choose a specific Product.
- **Visual Identity (Tool)**
    - **Text**: "Your Products cost 1 less if you have a Brand Effect."
    - **Status**: Marked as `passiveEffect`. Actual cost reduction needs to be implemented in `getCardDiscount` by checking if any card with the "Brand" keyword (or a new "Brand Effect" keyword/property) is in play.

### Automation Architect
- **Scale Systems (Tool)**
    - **Text**: "At the end of your turn, repeat the first Recurring effect you triggered this turn."
    - **Status**: `passiveEffect`. Logic for tracking and repeating the first recurring effect is missing from `processPassiveEffects` or end-of-turn phase.
- **Custom App (Tool)**
    - **Text**: "You may play this as an Action to copy a Tool's effect this turn."
    - **Status**: `passiveEffect`. Needs modal play implementation: choice to play as Action, then choice of a Tool on board to copy its effect.
- **Zap Everything (Action)**
    - **Status**: Partially implemented. Triggers some simple recurring Tool effects. Needs review to ensure all intended recurring effects are covered and correctly triggered (e.g., `auto_fulfill` condition, `shoestring_budget` interaction).

### Community Leader
- **Hype Train (Tool)**
    - **Text**: "Your team gets +1 capital whenever you gain Audience."
    - **Status**: `passiveEffect`. Requires Audience mechanic and logic for team-based effects (currently single-player).
- **Mentorship Circle (Tool)**
    - **Text**: "Your teammates may draw 1 extra card at the start of their turn."
    - **Status**: `passiveEffect`. Requires multiplayer support.

### Serial Founder
- **Advisory Board (Tool)**
    - **Text**: "Whenever you play a Product, draw 1 card."
    - **Status**: Current effect in `serial-founder-effects.ts` draws based on counts of Products, Tools, and Employees *on the board*, not when a Product is played. Needs to be moved to `handleCardPlayEffects` in `turnEffects.ts` to trigger when a Product card is played.
- **Black Friday Blitz (Action)**
    - **Text**: "Sell a Product. If it's your third Product this turn, gain 3 extra capital."
    - **Status**: Currently just sells a product. Conditional capital gain (checking if it's the 3rd *Product played or sold* this turn) is not implemented.

## III. UI & UX Enhancements

- **Advanced Player Choice UI**: 
    - UI for Custom App modal play choice.
    - UI for Incubator Resources option choice.
    // Multi-selection (e.g., Warehouse Expansion - current implementation is sequential single picks) - Needs UI to show X of Y selected if choice persists across clicks.
- **Tooltips**: Review all tooltips for clarity and completeness, especially for cards with complex or unimplemented effects.
- **Visual Feedback**: 
    - Enhance for other game states or effects (e.g., when a choice is pending generally).

## IV. Code & System Improvements

- **Multiplayer Support**: Adapt game logic and UI for multiplayer (if planned).
- **Card Balance**: Comprehensive playtesting and balancing of card costs, effects, and hero powers.
- **Test Coverage**: Implement unit and integration tests.
- **Styling**: Refactor inline styles to a more maintainable system (e.g., Tailwind CSS, CSS Modules).
- **`cardEffects.ts` Linter Issues**: Manually ensure `cardEffects.ts` is correctly refactored by removing all local helper function definitions and ensuring all callsites use imported helpers to resolve persistent linter errors. 