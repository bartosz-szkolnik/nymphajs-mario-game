import { CollisionDirection, Entity, Trait, Level } from '@nymphajs/core';

export const KILLABLE_TRAIT = 'killable';

export class Killable extends Trait {
  dead = false;
  private deadTime = 0;
  removeAfter = 2;

  constructor() {
    super(KILLABLE_TRAIT);
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    if (this.dead) {
      this.deadTime += deltaTime;

      if (this.deadTime > this.removeAfter) {
        this.queue(() => {
          level.entities.delete(entity);
        });
      }
    }
  }

  obstruct(entity: Entity, side: CollisionDirection) {}

  kill() {
    this.queue(() => {
      this.dead = true;
    });
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }
}
