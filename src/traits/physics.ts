import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

export const PHYSICS_TRAIT = 'physics';

export class Physics extends Trait {
  constructor() {
    super(PHYSICS_TRAIT);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider?.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider?.checkY(entity, gameContext, level);

    entity.vel.y += level.gravity * deltaTime;
  }
}
