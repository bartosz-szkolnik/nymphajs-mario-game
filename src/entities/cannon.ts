import type { AudioBoard, Entity, Level } from '@nymphajs/core';
import { Renderable } from '@nymphajs/dom-api';
import type { EntityFactories } from '../entities';
import { loadAudioBoard } from '../loaders/audio-loader';
import { findPlayers } from '../player';
import { Emitter, EMITTER_TRAIT } from '../traits/emitter';

const HOLD_FIRE_THRESHOLD = 30;

export async function loadCannon(
  audioContext: AudioContext,
  entityFactory: EntityFactories
) {
  return loadAudioBoard('cannon', audioContext).then((audioBoard) =>
    createCannonFactory(audioBoard, entityFactory)
  );
}

function createCannonFactory(
  audioBoard: AudioBoard,
  entityFactory: EntityFactories
) {
  function emitBullet(cannon: Entity, level: Level) {
    let direction = 1;
    for (const player of findPlayers(level)) {
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

    const bullet = entityFactory.bullet();
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

    cannon.addTrait(EMITTER_TRAIT, emitter);
    return cannon;
  };
}
