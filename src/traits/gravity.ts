import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

export class Gravity extends Trait {
  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    entity.vel.y += level.gravity * deltaTime;
  }
}
