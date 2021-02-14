import { Camera } from '@nymphajs/core';

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
