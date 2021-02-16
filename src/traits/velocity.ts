import { Entity, Trait, GameContext } from '@nymphajs/core';

export const VELOCITY_TRAIT = 'velocity';

export class Velocity extends Trait {
  constructor() {
    super(VELOCITY_TRAIT);
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
