import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

export const GRAVITY_TRAIT = 'gravity';

export class Gravity extends Trait {
  constructor() {
    super(GRAVITY_TRAIT);
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    entity.vel.y += level.gravity * deltaTime;
  }
}
