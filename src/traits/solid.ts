import {
  CollisionDirection,
  Entity,
  Trait,
  CollisionMatch,
} from '@nymphajs/core';

export const SOLID_TRAIT = 'solid';

export class Solid extends Trait {
  obstructs = true;

  constructor() {
    super(SOLID_TRAIT);
  }

  obstruct(entity: Entity, side: CollisionDirection, match: CollisionMatch) {
    if (!this.obstructs) {
      return;
    }

    if (side === 'bottom') {
      entity.bounds.bottom = match.y1;
      entity.vel.y = 0;
    }

    if (side === 'top') {
      entity.bounds.top = match.y2;
      entity.vel.y = 0;
    }

    if (side === 'left') {
      entity.bounds.left = match.x2;
      entity.vel.x = 0;
    }

    if (side === 'right') {
      entity.bounds.right = match.x1;
      entity.vel.x = 0;
    }
  }
}
