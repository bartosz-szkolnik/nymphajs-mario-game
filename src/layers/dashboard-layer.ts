import type { Entity, Level } from '@nymphajs/core';
import type { Font } from '@nymphajs/dom-api';
import { findPlayers } from '../player';
import { LevelTimer } from '../traits/level-timer';
import { Player } from '../traits/player';

function getPlayerTrait(entities: Set<Entity>) {
  for (const player of findPlayers(entities)) {
    return player.get(Player);
  }
}

function getTimerTrait(entities: Set<Entity>) {
  for (const entity of entities) {
    if (entity.has(LevelTimer)) {
      return entity.get(LevelTimer);
    }
  }
}

export function createDashboardLayer(font: Font, level: Level) {
  const lineOne = font.size;
  const lineTwo = font.size * 2;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const playerTrait = getPlayerTrait(level.entities);
    const timerTrait = getTimerTrait(level.entities);

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
