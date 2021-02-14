import { Entity, Layer, Camera } from '@nymphajs/core';
import { isRenderable } from '@nymphajs/dom-api';

export function createSpriteLayer(
  entities: Set<Entity>,
  width = 64,
  height = 64
): Layer {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;

  const spriteBufferContext = spriteBuffer.getContext('2d')!;

  return function drawSpriteLayer(
    context: CanvasRenderingContext2D,
    camera: Camera
  ) {
    entities.forEach((entity) => {
      if (!isRenderable(entity)) {
        return;
      }

      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);

      context.drawImage(
        spriteBuffer,
        entity.pos.x - camera.position.x,
        entity.pos.y - camera.position.y
      );
    });
  };
}
