import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

type EmitterFn = (entity: Entity, level: Level) => void;

export const EMITTER_TRAIT = 'emitter';

export class Emitter extends Trait {
  private interval = 4;
  private cooldown = this.interval;
  private emitters: EmitterFn[] = [];

  constructor() {
    super(EMITTER_TRAIT);
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    this.cooldown -= deltaTime;
    if (this.cooldown <= 0) {
      this.emit(entity, level);
      this.cooldown = this.interval;
    }
  }

  addEmitter(emitter: EmitterFn) {
    this.emitters.push(emitter);
  }

  private emit(entity: Entity, level: Level) {
    for (const emitter of this.emitters) {
      emitter(entity, level);
    }
  }
}
