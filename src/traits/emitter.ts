import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

type EmitterFn = (
  entity: Entity,
  gameContext: GameContext,
  level: Level
) => void;

export class Emitter extends Trait {
  private interval = 4;
  private cooldown = this.interval;
  private emitters: EmitterFn[] = [];

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    this.cooldown -= deltaTime;
    if (this.cooldown <= 0) {
      this.emit(entity, gameContext, level);
      this.cooldown = this.interval;
    }
  }

  addEmitter(emitter: EmitterFn) {
    this.emitters.push(emitter);
  }

  private emit(entity: Entity, gameContext: GameContext, level: Level) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, level);
    }
  }
}
