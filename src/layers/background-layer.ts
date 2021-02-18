import {
  Level,
  Matrix,
  Tile,
  Layer,
  TileResolver,
  Camera,
} from '@nymphajs/core';
import { SpriteSheet } from '@nymphajs/dom-api';

export function createBackgroundLayer(
  level: Level,
  tiles: Matrix<Tile>,
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
