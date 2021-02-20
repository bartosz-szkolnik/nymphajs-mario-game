import { Entity, Trait, GameContext } from '@nymphajs/core';

export class Velocity extends Trait {
  update(entity: Entity, { deltaTime }: GameContext) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
