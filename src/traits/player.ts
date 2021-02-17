import { Trait } from '@nymphajs/core';

export const PLAYER_TRAIT = 'player';

export class Player extends Trait {
  lives = 3;
  score = 0;

  constructor() {
    super(PLAYER_TRAIT);
  }
}
