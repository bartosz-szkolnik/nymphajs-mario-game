import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

export class LevelTimer extends Trait {
  static EVENT_TIMER_HURRY = Symbol('timer-hurry');
  static EVENT_TIMER_OK = Symbol('timer-ok');

  private readonly totalTime = 300;
  currentTime = this.totalTime;
  hurryTime = 100;
  hurryEmitted: boolean | null = null;

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    this.currentTime -= deltaTime * 2;

    if (this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
      level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
      this.hurryEmitted = true;
    }

    if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
      level.events.emit(LevelTimer.EVENT_TIMER_OK);
      this.hurryEmitted = false;
    }
  }
}
