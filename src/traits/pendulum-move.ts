import { CollisionDirection, Entity, Trait } from '@nymphajs/core';

export const PENDULUM_MOVE_TRAIT = 'pendulumMove';

export class PendulumMove extends Trait {
  speed = -30;
  enabled = true;

  constructor() {
    super(PENDULUM_MOVE_TRAIT);
  }

  update(entity: Entity) {
    if (this.enabled) {
      entity.vel.x = this.speed;
    }
  }

  obstruct(entity: Entity, side: CollisionDirection) {
    if (side === 'right' || side === 'left') {
      this.speed = -this.speed;
    }
  }
}
