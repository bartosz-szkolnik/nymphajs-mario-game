import { TileCollisionContext, TileCollisionHandler } from '@nymphajs/core';
import { Player } from '../traits/player';

export class CoinCollisionHandler implements TileCollisionHandler {
  tileType = 'coin';

  handleX(context: TileCollisionContext) {
    this.handle(context);
  }

  handleY(context: TileCollisionContext) {
    this.handle(context);
  }

  private handle({ entity, resolver, match }: TileCollisionContext) {
    if (entity.has(Player)) {
      entity.get(Player).addCoins(1);
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY);
    }
  }
}
