import { createAnimation } from '@nymphajs/core';
import { loadImage, loadJSON, SpriteSheet } from '@nymphajs/dom-api';

export async function loadSpriteSheet(name: string) {
  return loadJSON<SpriteSheetSpec>(`/sprites/${name}`).then(
    async (spriteSheetSpec) => {
      return Promise.all([
        spriteSheetSpec,
        loadImage(spriteSheetSpec.imageURL),
      ]).then(([spec, image]) => {
        const sprites = new SpriteSheet(image, spec.tileW, spec.tileH);

        if (spec.tiles) {
          spec.tiles.forEach((tileSpec) => {
            const { name, index } = tileSpec;
            sprites.defineTile(name, ...index);
          });
        }

        if (spec.frames) {
          spec.frames.forEach((frameSpec) => {
            const { name, rect } = frameSpec;
            sprites.define(name, ...rect);
          });
        }

        if (spec.animations) {
          spec.animations.forEach((animSpec) => {
            const { name, frameLen, frames } = animSpec;
            const animation = createAnimation(frames, frameLen);
            sprites.defineAnimation(name, animation);
          });
        }

        return sprites;
      });
    }
  );
}
