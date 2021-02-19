import { TileCollisionContext, TileCollisionHandler } from '@nymphajs/core';
import { Player, PLAYER_TRAIT } from '../traits/player';

export class CoinCollisionHandler implements TileCollisionHandler {
  tileType = 'coin';

  handleX(context: TileCollisionContext) {
    this.handle(context);
  }

  handleY(context: TileCollisionContext) {
    this.handle(context);
  }

  private handle({ entity, resolver, match }: TileCollisionContext) {
    if (entity.hasTrait(PLAYER_TRAIT)) {
      entity.getTrait<Player>(PLAYER_TRAIT).addCoins(1);
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY);
    }
  }
}
