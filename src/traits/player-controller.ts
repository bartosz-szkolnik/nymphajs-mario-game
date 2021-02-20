import { Entity, GameContext, Level, Trait, Vec2 } from '@nymphajs/core';
import { Killable } from './killable';

export class PlayerController extends Trait {
  private player: Entity | null = null;
  checkpoint = new Vec2(0, 0);

  setPlayer(entity: Entity) {
    this.player = entity;
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    if (!this.player) {
      return;
    }

    if (!level.entities.has(this.player)) {
      const { x, y } = this.checkpoint;
      this.player.pos.set(x, y);

      this.player.get(Killable).revive();
      level.entities.add(this.player);
    }
  }
}
