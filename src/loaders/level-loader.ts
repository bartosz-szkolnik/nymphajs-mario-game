import { Matrix, Tile, Level } from '@nymphajs/core';
import { loadJSON, SpriteSheet } from '@nymphajs/dom-api';
import { Factory } from '../entities';
import { createBackgroundLayer } from '../layers/background-layer';
import { createSpriteLayer } from '../layers/sprites-layer';
import { loadSpriteSheet } from '../loaders';

type ExpandedTile = {
  tile: TileSpec;
  x: number;
  y: number;
};

export function createLevelLoader(entityFactory: Record<string, Factory>) {
  return async function loadLevel(name: string) {
    return loadJSON<LevelSpec>(`levels/${name}`).then(async (levelSpec) => {
      return Promise.all([
        levelSpec,
        loadSpriteSheet(levelSpec.spriteSheet),
      ]).then(([levelSpec, backgroundSprites]: [LevelSpec, SpriteSheet]) => {
        const level = new Level();

        setupBackground(levelSpec, level, backgroundSprites);
        setupEntities(levelSpec, level, entityFactory);

        return level;
      });
    });
  };
}

function createGrid(tiles: TileSpec[], patterns?: Patterns) {
  const grid = new Matrix<Tile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }

  return grid;
}

function* expandTiles(tiles: TileSpec[], patterns?: Patterns) {
  function* walkTiles(
    tiles: TileSpec[],
    offsetX: number,
    offsetY: number
  ): Generator<ExpandedTile> {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const pattern = patterns && patterns[tile.name];
          const { tiles } = pattern || {};
          if (tiles) {
            yield* walkTiles(tiles, derivedX, derivedY);
          }
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}

function* expandSpan(
  xStart: number,
  xLen: number,
  yStart: number,
  yLen: number
) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;

  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
    }
  }
}

function expandRange(range: TileSpec['ranges'][0]) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  } else if (range.length === 3) {
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }

  return [];
}

function* expandRanges(ranges: TileSpec['ranges']) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function setupBackground(
  levelSpec: LevelSpec,
  level: Level,
  backgroundSprites: SpriteSheet
) {
  const { layers, patterns } = levelSpec;
  layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, patterns);

    const args = [level, grid, backgroundSprites] as const;
    const backgroundLayer = createBackgroundLayer(...args);

    level.compositor.addLayer(backgroundLayer);
    level.tileCollider.addGrid(grid);
  });
}

function setupEntities(
  levelSpec: LevelSpec,
  level: Level,
  entityFactory: Record<string, Factory>
) {
  levelSpec.entities.forEach(({ name, position: [x, y] }) => {
    const factory = entityFactory[name];
    if (factory) {
      const entity = factory();
      entity.pos.set(x, y);
      level.entities.add(entity);
    }
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.compositor.addLayer(spriteLayer);
}
