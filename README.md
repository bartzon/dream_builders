# Dream Builders - Cooperative Entrepreneurship Card Game

A cooperative digital card game where players work together as entrepreneurs to build a successful business and reach $1,000,000 in team revenue within ~8-10 turns.

## 🎮 Game Overview

Dream Builders is a strategic entrepreneurship card game where 1-4 players choose different business roles and work together to grow their startup. Each player manages their own deck and board while contributing to the shared revenue goal.

### Core Features
- **4 Hero Classes**: Marketer, Developer, Operator, and Visionary
- **Product-Based Economy**: Sell products with inventory management
- **Revenue Progression**: Designed to reach $1M in 8-10 turns with coordinated play
- **Complex Card Interactions**: Synergies, overhead costs, and passive effects
- **Modern UI**: Responsive design with horizontal scrolling and visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

4. Open your browser and navigate to the provided localhost URL

## 🎯 How to Play

### Objective
Work together to reach **$1,000,000 in team revenue** before all players exhaust their options.

### Turn Structure
1. **Capital Gain**: Set capital to current turn number (max 10)
2. **Overhead Payment**: Pay overhead costs or disable products
3. **Draw Phase**: Draw 1 card
4. **Main Phase**: Play cards, sell products, use hero abilities
5. **End Phase**: Process automatic sales and recurring effects

### Card Types

#### 🟢 Products
Revenue-generating cards with inventory that can be sold for money:
- **Inventory**: Number of items available to sell
- **Revenue per Sale**: Money earned per item sold
- **Overhead Cost**: Some products require capital payment each turn
- **Status**: Can be active/inactive

#### 🔵 Actions  
One-time effects that resolve immediately and are discarded.

#### 🟣 Tools
Passive effects that remain on the board and provide ongoing benefits.

#### 🟠 Employees
Ongoing helpers that provide passive bonuses or triggered abilities.

### Selling System
- Click "Sell" buttons under Products to generate revenue
- Revenue is modified by various cards and effects
- Some cards provide automatic sales each turn
- Inventory decreases with each sale

## 👥 Hero Classes

### 🔴 Marketer
**Focus**: Marketing campaigns, sales boosts, viral growth
- **Hero Power**: "Marketing Blitz" (2 capital)
  - Gain 2 capital, draw 1 card, all Products +$10k this turn
- **Playstyle**: High revenue per sale, marketing synergies
- **Key Cards**: Flash Sale Frenzy, Pop-up Shop, Viral Campaign

### 🔵 Developer  
**Focus**: Technical efficiency, automation, scaling
- **Hero Power**: "Code Sprint" (1 capital)
  - Next card costs 2 less, draw 1 card
- **Playstyle**: Cost reduction, revenue multipliers, automation
- **Key Cards**: Scaling Algorithm, SaaS Platform, AI Optimization

### 🟢 Operator
**Focus**: Operations, logistics, steady growth
- **Hero Power**: "Operational Excellence" (2 capital)
  - Gain 1 capital, all cards +$20k revenue this turn
- **Playstyle**: Consistent revenue, inventory management
- **Key Cards**: Fulfillment Center, Global Supply Network, Warehouse Manager

### 🟣 Visionary
**Focus**: High-risk strategies, funding, innovation
- **Hero Power**: "Visionary Insight" (1 capital)
  - Draw 3 cards, discard 1, gain $50k
- **Playstyle**: Big swings, funding rounds, risky investments
- **Key Cards**: Series A Funding, Moonshot R&D, Global Launch Event

## 🎮 Game Mechanics

### Capital System
- Start each turn with capital equal to turn number (max 10)
- Spend capital to play cards
- Various effects can modify capital gain

### Revenue Modifiers
Cards can boost sales revenue through:
- **Flash Sale**: +$50k per sale this turn
- **Scaling Algorithm**: Double all revenue
- **Social Media Ads**: +$10k passive bonus
- **Global Supply Network**: +$20k per item

### Overhead Management
Some high-value products require maintenance:
- Pay the overhead cost each turn or the product becomes inactive
- **Load Balancer** and **Patent Portfolio** reduce overhead costs
- **Security Patch** prevents products from being disabled

### Passive Effects
Many cards provide ongoing benefits:
- **Warehouse Manager**: +1 inventory on all products each turn
- **AI Salesbot**: Automatically sell 1 item each turn  
- **Venture Capitalist**: +2 capital each turn

## 🛠️ Technical Implementation

### Project Structure
```
src/
├── client/                 # React UI components
│   ├── components/        # Card, PlayerBoard, GameStatus, etc.
│   └── utils/            # Formatting utilities
├── game/                 # Core game logic
│   ├── data/            # Card definitions and hero data
│   │   ├── decks.ts     # All 60 cards (15 per hero)
│   │   └── heroes.ts    # Hero definitions and powers
│   ├── logic/           # Game mechanics
│   │   ├── cardEffects.ts     # Card effect implementations
│   │   ├── heroAbilities.ts   # Hero power effects
│   │   ├── turnEffects.ts     # Turn processing
│   │   └── effectContext.ts   # State management
│   ├── game.ts          # Main game definition
│   ├── state.ts         # Game state types
│   └── constants.ts     # Configuration values
```

### Key Technologies
- **React** + **TypeScript**: Frontend
- **boardgame.io**: Game state management and turn structure
- **Tailwind CSS**: Styling with custom scrollbars
- **Framer Motion**: Card animations
- **Vite**: Build tool and dev server

### Card Effect System
Each card effect is implemented as a function:
```typescript
'flash_sale_frenzy': (G, playerID, card) => {
  if (G.effectContext?.[playerID]) {
    G.effectContext[playerID].flashSaleActive = true;
  }
}
```

## 🎨 UI Features

### Responsive Design
- **Mobile-friendly**: Cards scroll horizontally on narrow screens
- **Visual Feedback**: Hover effects and disabled states
- **Type-specific Borders**: Each card type has colored borders
- **Scrollable Areas**: Handle many cards gracefully

### Game Status Panel
- Revenue progress bar toward $1M goal
- Turn counter and current player indicator
- Active effects display
- Player revenue summaries

### Sell System UI
- Dedicated sell buttons under each product
- Shows revenue amount in button text
- Automatically disabled when no inventory
- Visual indicators for inactive products

## 🎯 Game Balance

The game is tuned for coordinated teams to reach $1M in 8-10 turns:
- **Early Game** (Turns 1-3): Low capital, focus on playing cheap cards
- **Mid Game** (Turns 4-7): Scaling revenue with synergies and tools  
- **Late Game** (Turns 8-10): High capital enabling expensive power plays

Revenue progression typically follows:
- Turn 1-2: $0-50k total
- Turn 3-5: $100k-300k total  
- Turn 6-8: $400k-700k total
- Turn 9-10: $800k-1M+ total

## 🐛 Debug Features

- Console logging for capital changes and turn progression
- Effect context tracking for temporary bonuses
- Game state inspection via browser dev tools

## 📝 Adding New Content

### Adding a New Card
1. Add definition to appropriate deck in `src/game/data/decks.ts`
2. Implement effect in `src/game/logic/cardEffects.ts`
3. Test interactions with existing cards

### Modifying Game Balance
- Adjust revenue values in card definitions
- Modify `REVENUE_GOAL` in constants
- Tune capital costs and starting resources

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional card effects and synergies
- UI/UX enhancements
- Game balance tuning
- Performance optimizations

## 📄 License

MIT License - feel free to use and modify!
