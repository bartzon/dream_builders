# Test Suite Improvement Suggestions

## 1. Edge Case Testing ✅ IMPLEMENTED

### Current Status
Comprehensive edge case testing has been implemented with 33 tests covering:
- Resource limits (capital cap, inventory, revenue overflow)
- Empty collections (deck, board, hand)
- Invalid inputs (undefined contexts, malformed data)
- Boundary conditions (exact matches, zero values)
- Timing edge cases (turn 1, multiple effects)
- Choice system edge cases
- Card type specific edge cases
- Hero-specific edge cases

### Implementation Details
Created `edge-cases.test.ts` with 33 tests (all passing)

## 2. Integration Testing

### Current Gap
Tests are isolated to individual effects, missing interaction testing.

### Suggested Improvements
```typescript
describe('Effect Interactions', () => {
  it('should handle multiple cost reductions correctly', () => {
    // Play DIY Assembly (-1 to Products)
    // Play Visual Identity (-1 to Products if Tool)
    // Test final cost calculation
  })

  it('should process turn sequence with passive effects', () => {
    // Set up board with multiple passive effects
    // Simulate turn.onBegin
    // Verify all effects processed in correct order
  })
})
```

## 3. Performance Testing

### Current Gap
No performance benchmarks for complex board states.

### Suggested Improvements
```typescript
describe('Performance', () => {
  it('should handle large board states efficiently', () => {
    // Add 20+ cards to board
    // Measure time to process passive effects
    // Assert reasonable performance threshold
  })
})
```

## 4. Test Data Builders ✅ IMPLEMENTED

### Current Status
Created comprehensive test data builders with fluent API:
- **GameStateBuilder**: Fluent API for creating game states with products, tools, employees, capital, hero setup, effect context, etc.
- **CardBuilder**: Fluent API for creating cards with sensible defaults for each card type
- **TestScenarios**: Pre-built common test scenarios

### Implementation Details
Created `test-data-builders.ts` with:
- GameStateBuilder with methods like `withTools()`, `withProducts()`, `withEmployees()`, `withCapital()`, etc.
- CardBuilder with methods like `asProduct()`, `asTool()`, `asEmployee()`, `asAction()`
- TestScenarios factory with common setups like `withProductsReadyToSell()`, `withFullBoard()`, `atCapitalLimit()`
- Created `test-data-builders.test.ts` with 14 tests demonstrating usage

### Example Usage
```typescript
const G = new GameStateBuilder()
  .withHero('community_leader')
  .withCapital(7)
  .withTools(
    new CardBuilder().withName('Email Automation').asTool(),
    new CardBuilder().withName('Analytics Dashboard').asTool()
  )
  .withProducts(
    new CardBuilder().withInventory(5).asProduct()
  )
  .withEffectContext({
    cardsPlayedThisTurn: 2
  })
  .build()
```

## 5. Test Refactoring ✅ IMPLEMENTED

### Current Status
Successfully refactored existing tests to use the new test data builders:
- **edge-cases.test.ts**: Fully refactored to use GameStateBuilder and CardBuilder
- **card-effects.test.ts**: Refactored to use builders and simplified test setup
- **hero-card-effects.test.ts**: Refactored to use builders for cleaner state setup
- **hero-card-effects-complete.test.ts**: Added comprehensive card detail comments

### Implementation Details
- Replaced `createInitialGameState()` with `new GameStateBuilder().build()`
- Replaced manual state setup with fluent builder methods
- Added card detail comments to all tests including:
  - Card name, cost, and type
  - Full effect description
  - Hero power descriptions

### Example Refactoring
```typescript
// Before:
G = createInitialGameState()
G.players[playerID].capital = 5
G.players[playerID].board.Products = [createTestProduct()]

// After:
G = new GameStateBuilder()
  .withCapital(5)
  .withProducts(new CardBuilder().asProduct())
  .build()
```

## 6. Snapshot Testing

### Current Gap
Complex game states are tested with many assertions.

### Suggested Improvements
```typescript
it('should match expected game state after complex sequence', () => {
  // Set up initial state
  // Play several cards
  // expect(G).toMatchSnapshot()
})
```

## 7. Error Boundary Testing

### Current Gap
No tests for error conditions.

### Suggested Improvements
```typescript
describe('Error Handling', () => {
  it('should handle invalid card indices gracefully', () => {
    expect(() => {
      G.moves.playCard(-1)
    }).not.toThrow()
  })

  it('should handle malformed effect data', () => {
    // Test with corrupted card data
  })
})
```

## 8. Mock Testing for Isolation

### Current Gap
Tests depend on real implementations.

### Suggested Improvements
```typescript
import { vi } from 'vitest'

it('should call drawCard correct number of times', () => {
  const drawCardSpy = vi.spyOn(deckHelpers, 'drawCard')
  
  effectFn(G, playerID)
  
  expect(drawCardSpy).toHaveBeenCalledTimes(2)
})
```

## 9. Parameterized Testing ✅ IMPLEMENTED

### Current Status
Parameterized testing has been implemented to reduce repetition and improve test maintainability.

### Implementation Details
Created 4 new parameterized test files demonstrating different patterns:

1. **hero-powers.test.ts**: Tests all 5 hero powers with parameterized tests
   - Tests configuration (name, description, cost, effect name)
   - Tests implementation exists
   - Tests description pattern
   - 15 tests (3 per hero) using `describe.each()`

2. **passive-effects.test.ts**: Tests recurring and passive effects
   - Automatically discovers all cards with "Recurring" keyword
   - Tests specific capital gain effects pattern
   - 48 tests using `describe.each()` for different effect categories

3. **draw-effects.test.ts**: Tests draw card effects with variations
   - Simple draw effects (draw X cards)
   - Conditional draw effects (draw more if condition met)
   - Draw and discard effects
   - 14 tests covering various draw patterns

4. **cost-reduction.test.ts**: Tests cost reduction effects
   - Passive cost reduction effects
   - Immediate cost reduction actions
   - Dynamic cost cards (cost varies by board state)
   - 20 tests covering different reduction patterns

### Benefits
- **Reduced code duplication**: Similar tests are now expressed once with data
- **Better coverage**: Easy to add new test cases by adding data
- **More maintainable**: Changes to test logic only need to be made once
- **Self-documenting**: Test data clearly shows all variations being tested

### Example Usage
```typescript
describe.each(heroPowers)(
  '$hero.name Hero Power',
  ({ hero, effectName, cost }) => {
    it('should have correct configuration', () => {
      expect(hero.heroPower.cost).toBe(cost)
      expect(hero.heroPower.effect).toBe(effectName)
    })
  }
)
```

## 10. Visual Regression Testing

### Current Gap
No UI component testing.

### Suggested Improvements
- Add tests for card rendering
- Test animations (sparkles, etc.)
- Test responsive design
- Use tools like Playwright or Cypress

## 11. Documentation Testing

### Current Enhancement
Better documentation of passive effects.

### Suggested Improvements
```typescript
/**
 * @test-scenario DIY Assembly reduces Product costs
 * @passive-trigger Always active while on board
 * @implementation getCardDiscount()
 */
describe('diy_assembly', () => {
  // tests...
})
```

## 12. Test Organization ✅ IMPLEMENTED

### Current Status
Tests have been reorganized into a clean hierarchical structure following best practices.

### Implementation Details
Created organized test structure:
```
src/test/
├── unit/
│   ├── effects/
│   │   ├── solo-hustler.test.ts (11 tests)
│   │   ├── brand-builder.test.ts (10 tests)
│   │   ├── automation-architect.test.ts (11 tests)
│   │   ├── community-leader.test.ts (11 tests)
│   │   ├── serial-founder.test.ts (11 tests)
│   │   ├── inventory-support.test.ts (9 tests)
│   │   ├── game-mechanics.test.ts (15 tests - automatic sales, capital, game end)
│   │   └── hero-effects-basic.test.ts (15 tests - basic hero tests)
│   └── utils/
│       ├── test-data-builders.test.ts (14 tests)
│       ├── coverage-analysis.test.ts (2 tests)
│       └── discrepancy-report.test.ts (2 tests)
├── integration/
│   ├── edge-cases.test.ts (33 tests)
│   └── turn-flow.test.ts (6 tests)
├── e2e/
│   └── (empty - ready for future e2e tests)
├── test-data-builders.ts (shared test utilities)
├── test-helpers.ts (shared test utilities)
├── setup.ts (test configuration)
└── test-improvements.md (this file)
```

### Benefits
- Clear separation of unit, integration, and e2e tests
- Logical grouping by feature/hero
- Easy to find and maintain tests
- Scalable structure for future tests

## 13. Continuous Testing

### Suggested Additions
- Add mutation testing to verify test quality
- Add code coverage thresholds
- Add pre-commit hooks for test running
- Set up CI/CD pipeline with test reporting

## Priority Recommendations

1. **High Priority**: ~~Edge case testing~~ ✅, error handling, ~~Test data builders~~ ✅, ~~Test refactoring~~ ✅, ~~Test organization~~ ✅
2. **Medium Priority**: Integration tests ~~and parameterized testing~~, ~~parameterized testing~~ ✅
3. **Low Priority**: Performance testing and visual regression testing

## Current Test Suite Status
- **Total Tests**: 246 (all passing)
- **Test Files**: 17 organized test files
- **Coverage**: All cards, hero powers, major edge cases, test infrastructure, comprehensive card documentation, and parameterized testing patterns
- **Quality Improvements**: 
  - All tests now use fluent test data builders for cleaner setup
  - Card detail comments added to all card/hero power tests
  - Tests are more maintainable and readable
  - Clean organizational structure following best practices
  - Fixed test issues (e.g., spin_off Product card test, removed non-existent Brand Builder effects)
  - Parameterized tests reduce code duplication and improve maintainability
- **Next Steps**: Focus on integration tests and error boundary testing 