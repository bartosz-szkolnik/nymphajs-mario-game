import { KeyboardState, Renderable } from '@nymphajs/dom-api';
import { Go, GO_TRAIT } from './traits/go';
import { Jump, JUMP_TRAIT } from './traits/jump';

const SPACE = 'Space';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const SHIFT_LEFT = 'ShiftLeft';

export function setupKeyboard(mario: Renderable) {
  const input = new KeyboardState();

  input.addMapping(SPACE, (keyState) => {
    if (keyState) {
      mario.getTrait<Jump>(JUMP_TRAIT).start();
    } else {
      mario.getTrait<Jump>(JUMP_TRAIT).cancel();
    }
  });

  input.addMapping(SHIFT_LEFT, (keyState) => {
    mario.turbo(Boolean(keyState));
  });

  input.addMapping(ARROW_RIGHT, (keyState) => {
    mario.getTrait<Go>(GO_TRAIT).direction += keyState ? 1 : -1;
  });

  input.addMapping(ARROW_LEFT, (keyState) => {
    mario.getTrait<Go>(GO_TRAIT).direction += -keyState ? -1 : 1;
  });

  return input;
}
