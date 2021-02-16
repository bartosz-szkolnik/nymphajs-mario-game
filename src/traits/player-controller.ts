import { Entity, GameContext, Level, Trait, Vec2 } from '@nymphajs/core';
import { Killable, KILLABLE_TRAIT } from './killable';
import { Stomper, STOMPER_TRAIT } from './stomper';

export const PLAYER_CONTROLLER_TRAIT = 'playerController';

export class PlayerController extends Trait {
  private player: Entity | null = null;
  checkpoint = new Vec2(0, 0);
  time = 300;
  score = 0;

  constructor() {
    super(PLAYER_CONTROLLER_TRAIT);
  }

  setPlayer(entity: Entity) {
    this.player = entity;

    this.player.getTrait<Stomper>(STOMPER_TRAIT).events.listen('stomp', () => {
      this.score += 100;
    };
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    if (!this.player) {
      return;
    }

    if (!level.entities.has(this.player)) {
      const { x, y } = this.checkpoint;
      this.player.pos.set(x, y);
      this.player.getTrait<Killable>(KILLABLE_TRAIT).revive();
      level.entities.add(this.player);
    } else {
      this.time -= deltaTime * 2;
    }
  }
}
