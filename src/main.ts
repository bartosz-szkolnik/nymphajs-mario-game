import { Camera, GameContext, Timer } from '@nymphajs/core';
import { CanvasModule } from '@nymphajs/dom-api';
import { loadEntities } from './entities';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision-layer';
import { createDashboardLayer } from './layers/dashboard-layer';
import { loadFont } from './loaders/font-loader';
import { createLevelLoader } from './loaders/level-loader';
import { createPlayer, createPlayerEnv } from './player';

async function main(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const audioCtx = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioCtx),
    loadFont(),
  ]);

  const loadLevel = createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = createPlayer(entityFactory.mario());

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.compositor.addLayer(createCollisionLayer(level));
  level.compositor.addLayer(createDashboardLayer(font, playerEnv));

  const gameContext: GameContext = {
    deltaTime: 0,
    audioContext: audioCtx,
  };

  function update(deltaTime: number) {
    gameContext.deltaTime = deltaTime;
    level.update(gameContext);

    camera.position.x = Math.max(0, mario.pos.x - 100);
    level.compositor.draw(ctx, camera);
  }

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(update);
  timer.start();

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      console.log('Animation stopped!');
      cancelAnimationFrame(timer.animationFrameId);
    }
  });
}

const canvasModule = new CanvasModule();
const { canvas } = canvasModule.init('#canvas-container');

const start = () => {
  window.removeEventListener('click', start);
  main(canvas);
};
window.addEventListener('click', start);
