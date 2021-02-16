import { Entity, GameContext, Trait } from '@nymphajs/core';
import { Jump, JUMP_TRAIT } from './jump';

export const GO_TRAIT = 'go';

export class Go extends Trait {
  direction = 0;
  distance = 0;
  private acceleration = 400;
  private deceleration = 300;
  dragFactor = 1 / 5000;

  heading = 1;

  constructor() {
    super(GO_TRAIT);
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    const absX = Math.abs(entity.vel.x);
    if (this.direction !== 0) {
      entity.vel.x += this.acceleration * deltaTime * this.direction;

      const jumpTrait = entity.getTrait<Jump>(JUMP_TRAIT);
      if (jumpTrait) {
        if (jumpTrait.falling === false) {
          this.heading = this.direction;
        }
      } else {
        this.heading = this.direction;
      }
    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;

    this.distance += absX * deltaTime;
  }
}
