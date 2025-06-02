import type { GameState } from '../../state';
import type { Card } from '../../types';

const passiveEffect = () => {}; // For products with no special sale effect

// Effects triggered when specific Products are sold
export const productSaleCardEffects: Record<string, (G: GameState, playerID: string, card?: Card) => void> = {
  // All products with no special effects on sale
  'custom_dog_portrait_sale': passiveEffect,
  'minimalist_planner_sale': passiveEffect,
  'ai_logo_sale': passiveEffect,
  'sticker_pack_sale': passiveEffect,
  'digital_wedding_invite_sale': passiveEffect,
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
  'black_friday_sale': passiveEffect,
  'desk_clock_sale': passiveEffect,
}; 