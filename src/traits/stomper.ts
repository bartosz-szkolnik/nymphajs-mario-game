import { Entity, Trait } from '@nymphajs/core';
import { Killable, KILLABLE_TRAIT } from './killable';

export const STOMPER_TRAIT = 'stomper';

export class Stomper extends Trait {
  static EVENT_STOMP = Symbol('stomp');
  bounceSpeed = 400;

  constructor() {
    super(STOMPER_TRAIT);
  }

  bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.bounceSpeed;
  }

  collides(us: Entity, them: Entity) {
    if (
      !them.hasTrait(KILLABLE_TRAIT) ||
      them.getTrait<Killable>(KILLABLE_TRAIT).dead
    ) {
      return;
    }

    if (us.vel.y > them.vel.y) {
      this.queue(() => this.bounce(us, them));

      us.sounds.add('stomp');
      us.events.emit(Stomper.EVENT_STOMP, us, them);
    }
  }
}
