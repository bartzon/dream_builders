# Dream Builders - Entrepreneurship Card Game

A strategic digital card game where players take on the roles of entrepreneurs, building their startup to achieve a revenue goal.

Two rules for this project:
1. Nothing is written by hand, everything is vibe coded.
2. Blindly Accept all suggestions from Cursor, no reviewing of code.

## 🎮 Game Overview

Dream Builders is a card game for 1 player (currently) where you choose a hero with a unique playstyle and deck, then attempt to build your business to reach **$500,000 in revenue**.

### Core Features
- **5 Unique Heroes**: Each with distinct abilities and a 10-card starter deck that forms the basis of a 45-card drafted play deck.
  - Drafted deck composition: 10 hero starter cards + 10 additional hero cards + 7 inventory support cards + 18 product cards
- **Product-Based Economy**: Play Product cards, manage their inventory, and generate revenue through automatic sales and card effects.
- **Dynamic Card Effects**: Utilize Actions, deploy Tools for ongoing benefits, and hire Employees with unique skills.
- **Cost and Discount System**: Manage your Capital to play cards, and leverage effects that provide temporary or ongoing cost reductions.
- **Turn-Based Strategy**: Each turn presents new opportunities to draw cards, play your hand, and activate your hero power.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (or yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd cardgame
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the localhost URL provided (usually `http://localhost:5173` or the next available port).

## 🎯 How to Play

### Objective
Reach **$500,000 in revenue**.

### Game Flow
- **Hero Selection**: Choose one of the 5 available heroes at the start of the game.
- **Turn Structure**:
  1.  **Start of Turn**:
      *   Automatic sales from Products with inventory occur.
      *   Overhead costs for active Products are paid.
      *   Capital is gained (base amount increases with game turn, max 10).
      *   Passive effects from cards in play trigger.
      *   Draw 1 card (or as modified by effects).
      *   Hero ability is refreshed if used previously.
  2.  **Main Phase**: Play cards from your hand, use your hero power (once per turn).
  3.  **End of Turn**: Temporary effects expire.
- **Winning/Losing**: 
    - Win by reaching $500,000 revenue.
    - Lose if you cannot make any valid plays (no cards in deck, no playable cards in hand, and no products with inventory to sell).

### Card Types
- **🟢 Products**: Generate revenue. Have inventory that depletes with sales. Some have overhead costs.
- **🔵 Actions**: One-time effects; discarded after play.
- **🟣 Tools**: Provide ongoing passive or triggered benefits while in play.
- **🟠 Employees**: Similar to Tools, provide ongoing benefits or abilities.

## 🛠️ Heroes & Abilities

1.  **The Solo Hustler**
    *   **Playstyle**: Fast and scrappy, card draw, and cost reduction.
    *   **Hero Power (Grind - Cost 1)**: Draw 1 card. If it's a Product, its cost is reduced by 1 this turn.
    *   **Key Cards**: Hustle Hard, Bootstrap Capital, DIY Assembly, Fast Pivot, Shoestring Budget.

2.  **The Brand Builder**
    *   **Playstyle**: Synergy-focused, building brand presence (Audience mechanic largely unimplemented).
    *   **Hero Power (Engage - Cost 2)**: Give a Product +1 Appeal this turn (currently boosts global appeal due to choice UI not implemented).
    *   **Key Cards**: Brand Vision, Influencer Collab, Content Calendar, Personal Branding.

3.  **The Automation Architect**
    *   **Playstyle**: Builds an engine of passive income and efficiency over time.
    *   **Hero Power (Deploy Script - Cost 2)**: Gain 1 recurring Capital next turn.
    *   **Key Cards**: Auto Fulfill, Email Automation, Zap Everything, Technical Cofounder.

4.  **The Community Leader**
    *   **Playstyle**: High variance, explosive combo turns (Audience mechanic largely unimplemented).
    *   **Hero Power (Go Viral - Cost 1)**: If you played 2+ cards this turn, add +1 inventory to a random Product.
    *   **Key Cards**: Town Hall, Mutual Aid, Fanbase, Merch Drop.

5.  **The Serial Founder**
    *   **Playstyle**: Balanced and flexible with powerful mid-game options.
    *   **Hero Power (Double Down - Cost 2)**: Choose one: draw a card OR refresh 1 used Product (currently auto-chooses based on board state).
    *   **Key Cards**: Legacy Playbook, Advisory Board, High-Profile Exit, Incubator Resources.

## 🎮 Key Implemented Mechanics

*   **Core Game Loop**: Turn progression, capital gain, card draw.
*   **Card Play**: Playing Actions, Tools, Employees, and Products.
*   **Resource Management**: Capital for playing cards, Revenue as the win condition.
*   **Product System**: Products have inventory, generate revenue via automatic sales and card effects. Overhead costs are processed.
*   **Cost Discounts**: Various cards and hero powers provide temporary or specific cost reductions (e.g., Shoestring Budget, Resourceful Solutions, Solo Hustler's hero power).
*   **Delayed Effects**: Some effects trigger over subsequent turns (e.g., Fulfillment App Integration, Automation Architect's hero power).
*   **Basic Passive Effects**: Some Tools and Employees provide simple recurring benefits (e.g., gain capital).
*   **Player Choices**: Basic choice system for effects like discarding cards (Midnight Oil), destroying products (Fast Pivot), or choosing a product for an effect (most Inventory Support cards).
*   **UI Bonus Indicators**: Visual cues on cards for active discounts, revenue bonuses, and delayed effect counters.

## 🛠️ Technical Overview

- **Frontend**: React with TypeScript, Vite
- **Game Engine**: boardgame.io
- **Styling**: Inline styles (opportunity for Tailwind CSS or CSS Modules)
- **Project Structure**:
  ```
  src/
  ├── client/         # React UI components & hooks
  ├── game/           # Core game logic, card data, type definitions
  │   ├── data/       # Hero/card definitions (heroes in subfolder)
  │   ├── logic/      # Game rules, effects, turn phases (utils & effects in subfolders)
  │   └── ...         # state.ts, types.ts, constants.ts, game.ts
  └── ...             # main.tsx, App.tsx, etc.
  ```

## 🤝 Contributing

This project is a work in progress. Contributions are welcome, especially in areas like:
- Implementing missing card effects and the Audience mechanic.
- Enhancing UI/UX, especially for player choices.
- Game balancing and adding more diverse card interactions.

## 📄 License

MIT License.
