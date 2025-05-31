import React from 'react';
import type { ClientCard, PendingChoice, GameUIState } from '../../../types/game';
import { FONT_SIZES, BUTTON_STYLES, COLORS } from '../../../constants/ui';
import { GameCard } from './GameCard';

interface ChoiceModalProps {
  pendingChoice: PendingChoice | undefined;
  onMakeChoice: (choiceIndex: number, optionText?: string) => void;
  uiState: GameUIState;
}

export const ChoiceModal: React.FC<ChoiceModalProps> = React.memo(({
  pendingChoice,
  onMakeChoice,
  uiState,
}) => {
  if (!pendingChoice) return null;

  const { options, effect, type, cards, count } = pendingChoice;
  let title = 'Make a choice';
  let content = null;

  const getOptionDisabledState = (optionText: string): boolean => {
    if (effect === 'serial_founder_double_down') {
      if (optionText.toLowerCase().includes('add 2 inventory') && uiState.products.length === 0) {
        return true;
      }
    }
    return false;
  };

  switch (type) {
    case 'discard':
      title = effect === 'midnight_oil' ? 'Midnight Oil: Discard 1 Card' : 'Discard a Card';
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontSize: FONT_SIZES.body, margin: '0 0 10px 0' }}>
            Choose a card from your hand to discard:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {uiState.hand.map((card: ClientCard, index: number) => (
              <GameCard
                key={card.id || index}
                card={card}
                displayMode="choiceModal"
                isClickable={true}
                onClick={() => onMakeChoice(index)}
                isDiscardMode={true}
                enableHover={true}
              />
            ))}
          </div>
        </div>
      );
      break;

    case 'destroy_product':
      title = 'Fast Pivot: Destroy a Product';
      if (!cards || cards.length === 0) return null;
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontSize: FONT_SIZES.body, margin: '0 0 10px 0' }}>
            Choose a product to destroy. You'll draw 2 cards and your next Product costs 2 less.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {cards.map((card: ClientCard, index: number) => (
              <GameCard
                key={card.id || index}
                card={card}
                displayMode="choiceModal"
                isClickable={true}
                onClick={() => onMakeChoice(index)}
                enableHover={true}
              />
            ))}
          </div>
        </div>
      );
      break;

    case 'choose_card':
      if (!cards || cards.length === 0) return null;
      
      // Set title based on effect
      if (effect === 'serial_founder_double_down_add_inventory') {
        title = 'Double Down: Add Inventory';
      } else if (effect === 'brand_builder_engage_add_inventory') {
        title = 'Engage: Choose Product';
      } else if (effect === 'black_friday_blitz_sell_product') {
        title = 'Black Friday Blitz: Sell Product';
      } else if (effect === 'multi_product_inventory_boost') {
        title = 'Warehouse Expansion: Choose Products';
      } else if (effect === 'add_inventory_if_empty') {
        title = 'Reorder: Choose Empty Product';
      } else {
        title = 'Choose a Product';
      }

      content = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontSize: FONT_SIZES.body, margin: '0 0 10px 0' }}>
            {effect === 'serial_founder_double_down_add_inventory' && 'Choose a product to add +2 inventory'}
            {effect === 'brand_builder_engage_add_inventory' && 'Choose a product to add +2 inventory'}
            {effect === 'black_friday_blitz_sell_product' && 'Choose a product with inventory to sell'}
            {effect === 'add_inventory_if_empty' && 'Choose a product with 0 inventory to restock (+3)'}
            {effect === 'multi_product_inventory_boost' && 'Choose products to add +1 inventory each (up to 3 total)'}
            {!['serial_founder_double_down_add_inventory', 'brand_builder_engage_add_inventory', 'black_friday_blitz_sell_product', 'add_inventory_if_empty', 'multi_product_inventory_boost'].includes(effect || '') && 'Choose a product to boost'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {cards.map((card: ClientCard, index: number) => {
              // Check if card meets criteria for selection
              const isDisabled = effect === 'add_inventory_if_empty' && card.inventory !== 0;
              const isSelectable = effect === 'black_friday_blitz_sell_product' ? ((card.inventory || 0) > 0) : true;
              
              return (
                <div key={card.id || index} style={{ position: 'relative' }}>
                  <GameCard
                    card={card}
                    displayMode="choiceModal"
                    isClickable={!isDisabled && isSelectable}
                    onClick={() => onMakeChoice(index)}
                    enableHover={true}
                    style={{ opacity: (isDisabled || !isSelectable) ? 0.5 : 1 }}
                  />
                  {effect === 'add_inventory_if_empty' && card.inventory === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '5px', color: COLORS.success, fontWeight: 'bold' }}>
                      +3 Stock
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {effect === 'multi_product_inventory_boost' && (
            <button
              onClick={() => onMakeChoice(-1)} // -1 to signal "Done" selection
              style={{
                ...BUTTON_STYLES,
                background: COLORS.bgLight,
                color: COLORS.white,
                marginTop: '15px',
                padding: '10px 20px'
              }}
            >
              Done Selecting
            </button>
          )}
        </div>
      );
      break;

    case 'choose_option':
      if (!options) return null;
      if (effect === 'serial_founder_double_down') title = 'Double Down: Choose an Effect';
      else if (effect === 'incubator_resources_choice') title = 'Incubator Resources: Choose Bonus';
      
      content = (
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px', flexWrap: 'wrap' }}>
          {options.map((option: string, index: number) => {
            const isDisabled = getOptionDisabledState(option);
            return (
              <button
                key={index}
                onClick={() => !isDisabled && onMakeChoice(index, option)}
                disabled={isDisabled}
                style={{
                  ...BUTTON_STYLES,
                  background: isDisabled ? COLORS.disabled : COLORS.primary,
                  color: COLORS.white,
                  padding: '12px 20px',
                  fontSize: FONT_SIZES.medium,
                  minWidth: '160px',
                  opacity: isDisabled ? 0.6 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
      break;

    case 'view_deck_and_discard': // For Analytics Dashboard
      if (!cards || count === undefined) return null;
      title = 'Analytics Dashboard: View Top Deck';
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontSize: FONT_SIZES.body, margin: '0 0 10px 0'}}>
            Top {count} card{count === 1 ? '' : 's'} of your deck. Choose one to discard, or keep all.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {cards.map((card: ClientCard, index: number) => (
              <div key={card.id || index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <GameCard
                  card={card}
                  displayMode="choiceModal"
                  enableHover={true}
                />
                <button 
                  onClick={() => onMakeChoice(index)}
                  style={{...BUTTON_STYLES, background: COLORS.danger, padding: '6px 12px', fontSize: FONT_SIZES.small}}
                >
                  Discard {card.name}
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onMakeChoice(-1)} // -1 signifies 'Keep All' or 'Done'
            style={{...BUTTON_STYLES, background: COLORS.bgLight, marginTop: '15px', padding: '10px 20px'}}
          >
            Keep All / Done
          </button>
        </div>
      );
      break;

    case 'choose_from_drawn_to_discard': // For A/B Test
      if (!cards || cards.length === 0) return null;
      title = 'A/B Test: Choose Card to Discard';
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <p style={{fontSize: FONT_SIZES.body, margin: '0 0 10px 0'}}>You drew these cards. Click one to discard:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {cards.map((card: ClientCard, index: number) => (
              <GameCard
                key={card.id || index}
                card={card}
                displayMode="choiceModal"
                isClickable={true}
                onClick={() => onMakeChoice(index)}
                enableHover={true}
              />
            ))}
          </div>
        </div>
      );
      break;

    default:
      return null; // Don't render for unhandled or non-modal choice types
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(30, 41, 59, 0.98)',
      padding: '25px',
      borderRadius: '12px',
      border: `2px solid ${COLORS.primaryDark}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
      zIndex: 2000,
      color: COLORS.textLight,
      minWidth: '380px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: FONT_SIZES.heading, color: COLORS.white }}>{title}</h3>
      {content}
    </div>
  );
}); 