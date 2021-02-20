import { Entity, Trait } from '@nymphajs/core';
import { Stomper } from './stomper';

const COIN_LIVE_THRESHOLD = 100;

export class Player extends Trait {
  coins = 0;
  lives = 3;
  score = 0;
  displayName = '';

  constructor() {
    super();

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
    });
  }

  addCoins(count: number) {
    this.coins += count;
    this.queue((entity: Entity) => entity.sounds.add('coin'));

    while (this.coins >= COIN_LIVE_THRESHOLD) {
      this.addLives(1);
      this.coins -= COIN_LIVE_THRESHOLD;
    }
  }

  addLives(count: number) {
    this.lives += count;
  }
}
