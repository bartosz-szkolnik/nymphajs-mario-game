import { KeyboardState } from '@nymphajs/dom-api';
import { InputRouter } from '@nymphajs/core';
import { Go, GO_TRAIT } from './traits/go';
import { Jump, JUMP_TRAIT } from './traits/jump';

const SPACE = 'Space';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const SHIFT_LEFT = 'ShiftLeft';

export function setupKeyboard(window: Window) {
  const input = new KeyboardState();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping(SPACE, (keyState) => {
    if (keyState) {
      router.route((entity) => entity.getTrait<Jump>(JUMP_TRAIT).start());
    } else {
      router.route((entity) => entity.getTrait<Jump>(JUMP_TRAIT).cancel());
    }
  });

  input.addMapping(SHIFT_LEFT, (keyState) => {
    router.route((entity) => entity.turbo(Boolean(keyState)));
  });

  input.addMapping(ARROW_RIGHT, (keyState) => {
    router.route(
      (entity) => (entity.getTrait<Go>(GO_TRAIT).direction += keyState ? 1 : -1)
    );
  });

  input.addMapping(ARROW_LEFT, (keyState) => {
    router.route(
      (entity) =>
        (entity.getTrait<Go>(GO_TRAIT).direction += -keyState ? -1 : 1)
    );
  });

  return router;
}
