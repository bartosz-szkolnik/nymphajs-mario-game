export function createColorLayer(color: string) {
  return function drawColor(context: CanvasRenderingContext2D) {
    context.fillStyle = color;

    const { width, height } = context.canvas;
    context.fillRect(0, 0, width, height);
  };
}
