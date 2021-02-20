import {
  CollisionDirection,
  Entity,
  Trait,
  Level,
  GameContext,
} from '@nymphajs/core';

export class Killable extends Trait {
  private deadTime = 0;
  dead = false;
  removeAfter = 2;

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
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
