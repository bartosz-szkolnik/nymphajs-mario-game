import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadSpriteSheet } from '../loaders';
import { Go, GO_TRAIT } from '../traits/go';
import { Jump, JUMP_TRAIT } from '../traits/jump';
import { Killable, KILLABLE_TRAIT } from '../traits/killable';
import { Solid, SOLID_TRAIT } from '../traits/solid';
import { Stomper, STOMPER_TRAIT } from '../traits/stomper';

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export async function loadMario() {
  return loadSpriteSheet('mario').then(createMarioFactory);
}

function createMarioFactory(sprite: SpriteSheet) {
  const runAnim = sprite.animations.get('run');
  function routeFrame(mario: Renderable) {
    const { distance, direction } = mario.getTrait<Go>(GO_TRAIT);
    const { falling } = mario.getTrait<Jump>(JUMP_TRAIT);
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
    mario.getTrait<Go>(GO_TRAIT).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function drawMario(mario: Renderable, context: CanvasRenderingContext2D) {
    const flip = mario.getTrait<Go>(GO_TRAIT).heading < 0;
    sprite.draw(routeFrame(mario), context, 0, 0, flip);
  }

  return function createMario() {
    const mario = new Renderable();
    mario.size.set(16, 16);

    mario.addTrait(SOLID_TRAIT, new Solid());
    mario.addTrait(GO_TRAIT, new Go());
    mario.addTrait(JUMP_TRAIT, new Jump());
    mario.addTrait(KILLABLE_TRAIT, new Killable());
    mario.addTrait(STOMPER_TRAIT, new Stomper());
    mario.getTrait<Killable>(KILLABLE_TRAIT).removeAfter = 0;

    mario.turbo = (turboOn) => setTurboState(mario, turboOn);
    mario.draw = (ctx) => drawMario(mario, ctx);

    mario.turbo(false);

    return mario;
  };
}
