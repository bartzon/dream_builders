import type { Card } from '../types';

export const inventorySupportCards: Card[] = [
  {
    id: 'bulk_order_deal',
    name: 'Bulk Order Deal',
    cost: 2,
    type: 'Action',
    text: 'Choose a Product. Add +2 inventory.',
    flavor: 'Buy low, sell a lot.',
    effect: 'add_inventory_to_product'
  },
  {
    id: 'reorder_notification',
    name: 'Reorder Notification',
    cost: 1,
    type: 'Action',
    text: 'Choose a Product with 0 inventory. Add +3 inventory.',
    flavor: 'Running out? Not on our watch.',
    effect: 'add_inventory_if_empty'
  },
  {
    id: 'dropship_restock',
    name: 'Dropship Restock',
    cost: 2,
    type: 'Action',
    text: 'All Products with less than 2 inventory gain +1.',
    flavor: 'Your virtual shelves just got fuller.',
    effect: 'add_inventory_to_low_stock'
  },
  {
    id: 'warehouse_expansion',
    name: 'Warehouse Expansion',
    cost: 3,
    type: 'Action',
    text: 'Choose up to 3 Products. Add +1 inventory to each.',
    flavor: 'More room, more boom.',
    effect: 'multi_product_inventory_boost'
  },
  {
    id: 'viral_unboxing',
    name: 'Viral Unboxing Video',
    cost: 3,
    type: 'Action',
    text: 'Choose a Product. Add +1 inventory and +1 sale this turn.',
    flavor: 'Inventory\'s flying — and so are the views.',
    effect: 'inventory_and_sale_boost'
  },
  {
    id: 'supplier_collab',
    name: 'Supplier Collab',
    cost: 2,
    type: 'Action',
    text: 'Choose a Product. Add +2 inventory. Its next sale earns +1000.',
    flavor: 'We go further when we go together.',
    effect: 'inventory_boost_plus_revenue'
  },
  {
    id: 'fulfillment_integration',
    name: 'Fulfillment App Integration',
    cost: 2,
    type: 'Action',
    text: 'At the start of your next 2 turns, add +1 inventory to a random Product.',
    flavor: 'Bots don\'t sleep.',
    effect: 'delayed_inventory_boost'
  },
  {
    id: 'inventory_forecast_tool',
    name: 'Inventory Forecast Tool',
    cost: 1,
    type: 'Action',
    text: 'Draw 1. Then choose a Product to gain +1 inventory.',
    flavor: 'Guessing is out. Planning is in.',
    effect: 'draw_and_inventory'
  },
  {
    id: 'last_minute_restock',
    name: 'Last-Minute Restock',
    cost: 1,
    type: 'Action',
    text: 'Choose any Product. Add +1 inventory.',
    flavor: 'Ran out? Not today.',
    effect: 'simple_inventory_boost'
  }
]; 