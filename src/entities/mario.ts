import type { AudioBoard } from '@nymphajs/core';
import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadAudioBoard } from '../loaders/audio-loader';
import { loadSpriteSheet } from '../loaders/sprite-loader';
import { Go } from '../traits/go';
import { Jump } from '../traits/jump';
import { Killable } from '../traits/killable';
import { Physics } from '../traits/physics';
import { Solid } from '../traits/solid';
import { Stomper } from '../traits/stomper';

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export async function loadMario(audioContext: AudioContext) {
  return Promise.all([
    loadSpriteSheet('mario'),
    loadAudioBoard('mario', audioContext),
  ]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

function createMarioFactory(sprite: SpriteSheet, audioBoard: AudioBoard) {
  const runAnim = sprite.animations.get('run');
  function routeFrame(mario: Renderable) {
    const { distance, direction } = mario.get(Go);
    const { falling } = mario.get(Jump);

    if (falling) {
      return 'jump';
    }

    if (distance > 0) {
      if (
        (mario.vel.x > 0 && direction < 0) ||
        (mario.vel.x < 0 && direction > 0)
      ) {
        return 'break';
      }

      if (runAnim) {
        return runAnim(distance);
      }
    }

    return 'idle';
  }

  function setTurboState(mario: Renderable, turboOn: boolean) {
    mario.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function drawMario(mario: Renderable, context: CanvasRenderingContext2D) {
    const flip = mario.get(Go).heading < 0;
    sprite.draw(routeFrame(mario), context, 0, 0, flip);
  }

  return function createMario() {
    const mario = new Renderable();
    mario.audio = audioBoard;
    mario.size.set(14, 16);

    mario.addTrait(new Physics());
    mario.addTrait(new Solid());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());
    mario.get(Killable).removeAfter = 0;

    mario.turbo = (turboOn) => setTurboState(mario, turboOn);
    mario.draw = (ctx) => drawMario(mario, ctx);

    mario.turbo(false);

    return mario;
  };
}
