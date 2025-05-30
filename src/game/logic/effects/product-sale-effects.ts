import type { GameState } from '../../state';
import type { Card } from '../../types';
import { drawCards, applyTemporaryBonus } from '../utils/effect-helpers';

const passiveEffect = () => {}; // For products with no special sale effect

// Effects triggered when specific Products are sold
export const productSaleCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // Custom Dog Portrait: (On Sale) Draw 1 card.
  'custom_dog_portrait_sale': (G, playerID) => drawCards(G, playerID, 1),
  // Minimalist Planner: (On Sale) Draw 1 card.
  'minimalist_planner_sale': (G, playerID) => drawCards(G, playerID, 1),
  // AI Logo Generator: (On Sale) Draw 1 card.
  'ai_logo_sale': (G, playerID) => drawCards(G, playerID, 1),
  // Sticker Pack: (On Sale) Draw 1 card.
  'sticker_pack_sale': (G, playerID) => drawCards(G, playerID, 1),
  // Digital Wedding Invite: (On Sale) Draw 1 card.
  'digital_wedding_invite_sale': (G, playerID) => drawCards(G, playerID, 1),
  
  // Products with no special effects on sale
  'holiday_mug_sale': passiveEffect,
  'soy_candle_sale': passiveEffect,
  'sweater_bundle_sale': passiveEffect,
  'yoga_course_sale': passiveEffect,
  'name_necklace_sale': passiveEffect,
  'pet_box_sale': passiveEffect,
  'self_care_sale': passiveEffect,
  'tshirt_drop_sale': passiveEffect,
  'coffee_sampler_sale': passiveEffect,
  'wedding_invite_sale': passiveEffect,
  'enamel_pin_sale': passiveEffect,
  'eco_tote_sale': passiveEffect,
  'freelancing_ebook_sale': passiveEffect,
  'phone_case_sale': passiveEffect,
  'art_print_sale': passiveEffect,
  'planner_stickers_sale': passiveEffect,
  'pop_hoodie_sale': passiveEffect,
  'water_bottle_sale': passiveEffect,
  'makeup_brush_sale': passiveEffect,
  'subscription_trial_sale': passiveEffect,
  'budget_tracker_sale': passiveEffect,
  'dinosaur_tee_sale': passiveEffect,
  'bath_bomb_sale': passiveEffect,
  'greeting_cards_sale': passiveEffect,

  // Products with special effects on sale
  // Black Friday Deal: (On Sale) Next Product purchase +$2000 revenue (this seems like a purchase bonus, not sale bonus)
  // Current: applyTemporaryBonus(G, playerID, 'nextProductBonus', 2000)
  'black_friday_sale': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextProductBonus', 2000);
  },
  // Desk Clock: (On Sale) Next card costs 1 less.
  'desk_clock_sale': (G, playerID) => {
    applyTemporaryBonus(G, playerID, 'nextCardDiscount', 1);
  },
}; 