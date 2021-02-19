import { Trait } from '@nymphajs/core';
import { Stomper } from './stomper';

export const PLAYER_TRAIT = 'player';

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
}
