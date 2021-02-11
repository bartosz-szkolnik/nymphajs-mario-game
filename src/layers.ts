import {
  Camera,
  Matrix,
  TileResolver,
  GameTile,
  Level,
  Entity,
  Layer,
} from '@nymphajs/core';
import type { SpriteSheet } from '@nymphajs/dom-api';
import { isRenderable } from '@nymphajs/dom-api';

export function createBackgroundLayer(
  level: Level,
  tiles: Matrix<GameTile>,
  sprites: SpriteSheet
): Layer {
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240;

  const context = buffer.getContext('2d')!;

  function redraw(startIndex: number, endIndex: number) {
    const { width, height } = buffer;
    context.clearRect(0, 0, width, height);

    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            const totalTime = level.totalTime;
            const xOffset = x - startIndex;
            sprites.drawAnimation(tile.name, context, xOffset, y, totalTime);
          } else {
            sprites.drawTile(tile.name, context, x - startIndex, y);
          }
        });
      }
    }
  }

  return function drawBackgroundLayer(
    context: CanvasRenderingContext2D,
    camera: Camera
  ) {
    const drawWidth = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.position.x);
    const drawTo = drawFrom + drawWidth;

    redraw(drawFrom, drawTo);

    context.drawImage(buffer, -camera.position.x % 16, -camera.position.y);
  };
}

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

export function createCollisionLayer(level: Level): Layer {
  const resolvedTiles: Record<string, number>[] = [];

  const tileResolver = level.tileCollider!.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x: number, y: number) {
    resolvedTiles.push({ x, y });

    return getByIndexOriginal.call(this, x, y);
  };

  return function drawCollision(
    context: CanvasRenderingContext2D,
    camera: Camera
  ) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(
        x * tileSize - camera.position.x,
        y * tileSize - camera.position.y,
        tileSize,
        tileSize
      );
      context.stroke();
    });

    context.strokeStyle = 'red';
    level.entities.forEach((entity) => {
      context.beginPath();
      context.rect(
        entity.bounds.left - camera.position.x,
        entity.bounds.top - camera.position.y,
        entity.size.x,
        entity.size.y
      );
      context.stroke();
    });

    resolvedTiles.length = 0;
  };
}

export function createCameraLayer(cameraToDraw: Camera) {
  return function drawCameraRect(
    context: CanvasRenderingContext2D,
    fromCamera: Camera
  ) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(
      cameraToDraw.position.x - fromCamera.position.x,
      cameraToDraw.position.y - fromCamera.position.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}
