import type { AudioBoard, Entity, GameContext, Level } from '@nymphajs/core';
import { Renderable } from '@nymphajs/dom-api';
import { loadAudioBoard } from '../loaders/audio-loader';
import { findPlayers } from '../player';
import { Emitter } from '../traits/emitter';

const HOLD_FIRE_THRESHOLD = 30;

export async function loadCannon(audioContext: AudioContext) {
  return loadAudioBoard('cannon', audioContext).then((audioBoard) =>
    createCannonFactory(audioBoard)
  );
}

function createCannonFactory(audioBoard: AudioBoard) {
  function emitBullet(cannon: Entity, gameContext: GameContext, level: Level) {
    let direction = 1;
    for (const player of findPlayers(level.entities)) {
      if (
        player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD &&
        player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD
      ) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        direction = -1;
      }
    }

    const bullet = gameContext.entityFactory.bullet();
    bullet.vel.set(80 * direction, 0);

    cannon.sounds.add('shoot');
    bullet.pos.copy(cannon.pos);
    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Renderable();
    cannon.audio = audioBoard;

    const emitter = new Emitter();
    emitter.addEmitter(emitBullet);

    cannon.addTrait(emitter);
    return cannon;
  };
}
