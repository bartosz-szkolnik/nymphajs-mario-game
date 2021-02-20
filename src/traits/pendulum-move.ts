import { CollisionDirection, Entity, Trait } from '@nymphajs/core';

export class PendulumMove extends Trait {
  speed = -30;
  enabled = true;

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
