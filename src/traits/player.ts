import { Entity, Trait } from '@nymphajs/core';
import { Stomper } from './stomper';

export const PLAYER_TRAIT = 'player';
const COIN_LIVE_THRESHOLD = 100;

export class Player extends Trait {
  coins = 0;
  lives = 3;
  score = 0;
  displayName = '';

  constructor() {
    super(PLAYER_TRAIT);

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
    });
  }

  addCoins(count: number) {
    this.coins += count;
    this.queue((entity: Entity) => entity.sounds.add('coin'));

    if (this.coins >= COIN_LIVE_THRESHOLD) {
      const lifeCount = Math.floor(this.coins / COIN_LIVE_THRESHOLD);

      this.addLives(lifeCount);
      this.coins %= COIN_LIVE_THRESHOLD;
    }
  }

  addLives(count: number) {
    this.lives += count;
  }
}
