import { CollisionDirection, Entity, GameContext, Trait } from '@nymphajs/core';

export const JUMP_TRAIT = 'jump';
const SPEED_BOOST = 0.3;

export class Jump extends Trait {
  private duration = 0.3;
  private velocity = 200;
  private engageTime = 0;
  private ready = 0;
  private requestTime = 0;
  private gracePeriod = 0.1;

  constructor() {
    super(JUMP_TRAIT);
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        entity.sounds.add('jump');
        this.engageTime = this.duration;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * SPEED_BOOST);
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }

  obstruct(entity: Entity, side: CollisionDirection) {
    if (side === 'bottom') {
      this.ready = 1;
    } else if (side === 'top') {
      this.cancel();
    }
  }
}
