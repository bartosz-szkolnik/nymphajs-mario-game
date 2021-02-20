import type { Level } from '@nymphajs/core';
import type { Font } from '@nymphajs/dom-api';
import { findPlayers } from '../player';
import { LevelTimer, LEVEL_TIMER_TRAIT } from '../traits/level-timer';
import { Player, PLAYER_TRAIT } from '../traits/player';

function getPlayerTrait(level: Level) {
  for (const player of findPlayers(level)) {
    return player.getTrait<Player>(PLAYER_TRAIT);
  }
}

function getTimerTrait(level: Level) {
  for (const entity of level.entities) {
    if (entity.hasTrait(LEVEL_TIMER_TRAIT)) {
      return entity.getTrait<LevelTimer>(LEVEL_TIMER_TRAIT);
    }
  }
}

export function createDashboardLayer(font: Font, level: Level) {
  const lineOne = font.size;
  const lineTwo = font.size * 2;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const playerTrait = getPlayerTrait(level);
    const timerTrait = getTimerTrait(level);

    if (!playerTrait || !timerTrait) {
      return;
    }

    const currentTime = timerTrait.currentTime.toFixed().padStart(3, '0');
    const score = String(playerTrait.score).padStart(6, '0');

    font.print(playerTrait.displayName, context, 16, lineOne);
    font.print(score, context, 16, lineTwo);

    font.print(`@x${playerTrait.coins}`, context, 96, lineTwo);

    font.print('WORLD', context, 152, lineOne);
    font.print(level.name, context, 160, lineTwo);

    font.print('TIME', context, 200, lineOne);
    font.print(currentTime, context, 208, lineTwo);
  };
}
