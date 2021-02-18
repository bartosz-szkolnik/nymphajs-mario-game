import { TileCollisionContext, TileCollisionHandler } from '@nymphajs/core';

export class BrickCollisionHandler implements TileCollisionHandler {
  tileType: string = 'brick';

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
  handleY(tileCollisionContext: TileCollisionContext) {
    const {
      entity,
      match,
      resolver,
      level,
      gameContext,
    } = tileCollisionContext;

    if (entity.vel.y > 0) {
      if (entity.bounds.bottom > match.y1) {
        entity.obstruct('bottom', match);
      }
    } else if (entity.vel.y < 0) {
      if (entity.hasTrait('player')) {
        const grid = resolver.matrix;
        grid.delete(match.indexX, match.indexY);

        const goomba = gameContext.entityFactory.goomba();
        goomba.vel.set(50, -400);
        goomba.pos.set(entity.pos.x, match.y1);
        level.entities.add(goomba);
      }

      if (entity.bounds.top < match.y2) {
        entity.obstruct('top', match);
      }
    }
  }
}
