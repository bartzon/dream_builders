import React from 'react';
import type { ClientCard, PendingChoice } from '../../../types/game'; // Use PendingChoice
import { FONT_SIZES, BUTTON_STYLES, COLORS } from '../../../constants/ui';
import { ChoiceCardDisplay } from './ChoiceCardDisplay';

interface ChoiceModalProps {
  pendingChoice: PendingChoice | undefined; // Corrected type
  onMakeChoice: (choiceIndex: number, optionText?: string) => void;
  // Add other necessary props, e.g., uiState if needed for disabling options
  currentProductsCount: number; // Needed for disabling Double Down option
}

export const ChoiceModal: React.FC<ChoiceModalProps> = React.memo(({
  pendingChoice,
  onMakeChoice,
  currentProductsCount,
}) => {
  if (!pendingChoice) return null;

  const { options, effect, type, cards, count } = pendingChoice;
  let title = 'Make a choice';
  let content = null;

  const getOptionDisabledState = (optionText: string): boolean => {
    if (effect === 'serial_founder_double_down') {
      if (optionText.toLowerCase().includes('add 2 inventory') && currentProductsCount === 0) {
        return true;
      }
    }
    return false;
  };

  switch (type) {
    case 'choose_option':
      if (!options) return null;
      if (effect === 'serial_founder_double_down') title = 'Double Down: Choose an Effect';
      // Add more titles for other 'choose_option' effects here
      // else if (effect === 'incubator_resources_choice') title = 'Incubator: Choose Resource';
      
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
              <div key={card.id || index} style={{ textAlign: 'center' }}>
                <ChoiceCardDisplay card={card} />
                <button 
                  onClick={() => onMakeChoice(index)}
                  style={{...BUTTON_STYLES, background: COLORS.danger, marginTop: '8px', padding: '8px 16px'}}
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
              <ChoiceCardDisplay 
                key={card.id || index} 
                card={card} 
                isClickable={true} 
                onClick={() => onMakeChoice(index)} 
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