import { Camera } from '@nymphajs/core';
import { CanvasModule, Renderable } from '@nymphajs/dom-api';

export function setupMouseControl(
  canvasModule: CanvasModule,
  entity: Renderable,
  camera: Camera
) {
  let lastEvent: MouseEvent;

  ['mousedown', 'mousemove'].forEach((eventName) => {
    canvasModule.canvas.addEventListener(
      eventName as any,
      (event: MouseEvent) => {
        if (event.buttons === 2) {
          entity.vel.set(0, 0);
          entity.pos.set(
            event.offsetX + camera.position.x,
            event.offsetY + camera.position.y
          );
        } else if (
          event.buttons === 1 &&
          lastEvent &&
          lastEvent.buttons === 1 &&
          lastEvent.type === 'mousemove'
        ) {
          camera.position.x -= event.offsetX - lastEvent.offsetX;
        }

        lastEvent = event;
      }
    );
  });

  canvasModule.canvas.addEventListener('contextmenu', (e) =>
    e.preventDefault()
  );
}
