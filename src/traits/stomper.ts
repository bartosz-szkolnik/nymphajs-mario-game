import { Entity, Trait } from '@nymphajs/core';
import { KILLABLE_TRAIT } from './killable';

export const STOMPER_TRAIT = 'stomper';

export class Stomper extends Trait {
  bounceSpeed = 400;

  constructor() {
    super(STOMPER_TRAIT);
  }

  bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.bounceSpeed;
  }

  collides(us: Entity, them: Entity) {
    if (them.hasTrait(KILLABLE_TRAIT) && us.vel.y > them.vel.y) {
      this.bounce(us, them);
    }
  }
}
