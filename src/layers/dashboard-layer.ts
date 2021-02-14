import type { Entity } from '@nymphajs/core';
import type { Font } from '@nymphajs/dom-api';
import {
  PlayerController,
  PLAYER_CONTROLLER_TRAIT,
} from '../traits/player-controller';

export function createDashboardLayer(font: Font, playerEnv: Entity) {
  const lineOne = font.size;
  const lineTwo = font.size * 2;

  const coins = String(13).padStart(2, '0');

  const playerController = playerEnv.getTrait<PlayerController>(
    PLAYER_CONTROLLER_TRAIT
  );

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const { time, score } = playerController;

    font.print('MARIO', context, 16, lineOne);
    font.print(String(score).padStart(6, '0'), context, 16, lineTwo);

    font.print(`@x${coins}`, context, 96, lineTwo);

    font.print('WORLD', context, 152, lineOne);
    font.print('1-1', context, 160, lineTwo);

    font.print('TIME', context, 200, lineOne);
    font.print(time.toFixed().padStart(3, '0'), context, 208, lineTwo);
  };
}
