import { TileCollisionContext, TileCollisionHandler } from '@nymphajs/core';

export class GroundCollisionHandler implements TileCollisionHandler {
  tileType = 'ground';

  handleX({ entity, match }: TileCollisionContext) {
    if (entity.vel.x > 0) {
      if (entity.bounds.right > match.x1) {
        entity.obstruct('right', match);
      }
    } else if (entity.vel.x < 0) {
      if (entity.bounds.left < match.x2) {
        entity.obstruct('left', match);
      }
    }
  }

  handleY({ entity, match }: TileCollisionContext) {
    if (entity.vel.y > 0) {
      if (entity.bounds.bottom > match.y1) {
        entity.obstruct('bottom', match);
      }
    } else if (entity.vel.y < 0) {
      if (entity.bounds.top < match.y2) {
        entity.obstruct('top', match);
      }
    }
  }
}
