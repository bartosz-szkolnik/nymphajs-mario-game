import { KeyboardState } from '@nymphajs/dom-api';
import { InputRouter } from '@nymphajs/core';
import { Go } from './traits/go';
import { Jump } from './traits/jump';

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
      router.route((entity) => entity.get(Jump).start());
    } else {
      router.route((entity) => entity.get(Jump).cancel());
    }
  });

  input.addMapping(SHIFT_LEFT, (keyState) => {
    router.route((entity) => entity.turbo(Boolean(keyState)));
  });

  input.addMapping(ARROW_RIGHT, (keyState) => {
    router.route((entity) => (entity.get(Go).direction += keyState ? 1 : -1));
  });

  input.addMapping(ARROW_LEFT, (keyState) => {
    router.route((entity) => (entity.get(Go).direction += -keyState ? -1 : 1));
  });

  return router;
}
