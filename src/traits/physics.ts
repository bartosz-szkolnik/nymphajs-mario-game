import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

export const PHYSICS_TRAIT = 'physics';

export class Physics extends Trait {
  constructor() {
    super(PHYSICS_TRAIT);
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider?.checkX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider?.checkY(entity);

    entity.vel.y += level.gravity * deltaTime;
  }
}
