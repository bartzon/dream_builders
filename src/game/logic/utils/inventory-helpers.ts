import type { PlayerState } from '../../state';
import type { Card } from '../../types';

export function findProductWithInventory(player: PlayerState): Card | undefined {
  return player.board.Products.find((p: Card) => p.inventory && p.inventory > 0);
}

export function addInventoryToSpecificProduct(product: Card, amount: number): void {
  if (product.inventory !== undefined) {
    product.inventory += amount;
  }
} 