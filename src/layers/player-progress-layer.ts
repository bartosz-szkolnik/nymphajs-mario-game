import type { Level } from '@nymphajs/core';
import { Font, isRenderable } from '@nymphajs/dom-api';
import { findPlayers } from '../player';
import { Player, PLAYER_TRAIT } from '../traits/player';

function getPlayer(level: Level) {
  for (const player of findPlayers(level)) {
    return player;
  }
}

export function createPlayerProgressLayer(font: Font, level: Level) {
  const size = font.size;

  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = 32;
  spriteBuffer.height = 32;
  const spriteBufferContext = spriteBuffer.getContext('2d')!;

  return function drawPlayerProgress(context: CanvasRenderingContext2D) {
    const entity = getPlayer(level);
    if (!entity) {
      return;
    }

    const playerTrait = entity.getTrait<Player>(PLAYER_TRAIT);
    const lives = String(playerTrait.lives).padStart(3, ' ');

    font.print(`WORLD ${level.name}`, context, size * 12, size * 12);
    font.print(`x ${lives}`, context, size * 16, size * 16);

    if (isRenderable(entity)) {
      const { width, height } = spriteBuffer;
      spriteBufferContext.clearRect(0, 0, width, height);

      entity.draw(spriteBufferContext);
      context.drawImage(spriteBuffer, size * 12, size * 15);
    }
  };
}
