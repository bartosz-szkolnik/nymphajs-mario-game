import { Level, Layer, Camera, Entity, TileCollider } from '@nymphajs/core';

export function createCollisionLayer(level: Level): Layer {
  const drawTileCandidates = createTileCandidateLayer(level.tileCollider!);
  const drawBoundingBoxes = createEntityLayer(level.entities);

  return function drawCollision(
    context: CanvasRenderingContext2D,
    camera: Camera
  ) {
    drawTileCandidates(context, camera);
    drawBoundingBoxes(context, camera);
  };
}

function createTileCandidateLayer(tileCollider: TileCollider) {
  const resolvedTiles: Record<string, number>[] = [];

  const tileResolver = tileCollider!.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x: number, y: number) {
    resolvedTiles.push({ x, y });

    return getByIndexOriginal.call(this, x, y);
  };

  return function drawTileCandidates(
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

    resolvedTiles.length = 0;
  };
}

function createEntityLayer(entities: Set<Entity>) {
  return function drawBoundingBox(
    context: CanvasRenderingContext2D,
    camera: Camera
  ) {
    context.strokeStyle = 'red';
    entities.forEach((entity) => {
      context.beginPath();
      context.rect(
        entity.bounds.left - camera.position.x,
        entity.bounds.top - camera.position.y,
        entity.size.x,
        entity.size.y
      );
      context.stroke();
    });
  };
}
