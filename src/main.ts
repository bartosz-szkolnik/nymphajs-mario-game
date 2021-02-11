import { Camera, Entity, Timer } from '@nymphajs/core';
import { CanvasModule } from '@nymphajs/dom-api';
import { loadEntities } from './entities';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers';
import { createLevelLoader } from './loaders/level-loader';
import {
  PlayerController,
  PLAYER_CONTROLLER_TRAIT,
} from './traits/player-controller';

function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.setPlayer(playerEntity);
  playerController.checkpoint.set(64, 64);

  playerEnv.addTrait(PLAYER_CONTROLLER_TRAIT, playerController);
  return playerEnv;
}

async function main(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;

  const entityFactory = await loadEntities();
  const loadLevel = createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.compositor.addLayer(createCollisionLayer(level));

  function update(deltaTime: number) {
    level.update(deltaTime);

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
const { canvas } = canvasModule.init('canvas-container');

main(canvas);
