import {
  CompositionScene,
  Entity,
  GameContext,
  Level,
  SceneRunner,
  Timer,
} from '@nymphajs/core';
import { CanvasModule } from '@nymphajs/dom-api';
import { loadEntities } from './entities';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision-layer';
import { createColorLayer } from './layers/color-layer';
import { createDashboardLayer } from './layers/dashboard-layer';
import { createPlayerProgressLayer } from './layers/player-progress-layer';
import { loadFont } from './loaders/font-loader';
import { createLevelLoader } from './loaders/level-loader';
import { createPlayer, createPlayerEnv } from './player';
import { BrickCollisionHandler } from './tiles/brick';
import { CoinCollisionHandler } from './tiles/coin';
import { GroundCollisionHandler } from './tiles/ground';
import { Player, PLAYER_TRAIT } from './traits/player';

async function main(canvas: HTMLCanvasElement) {
  const videoContext = canvas.getContext('2d')!;
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = createPlayer(entityFactory.mario());
  mario.getTrait<Player>(PLAYER_TRAIT).displayName = 'MARIO';

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  const gameContext: GameContext = {
    deltaTime: 0,
    videoContext,
    audioContext,
    entityFactory,
  };

  function update(deltaTime: number) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  }

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(update);
  timer.start();
  runLevel('debug-progression');

  async function runLevel(name: string) {
    const level = await loadLevel(name);

    level.events.listen<any>(
      Level.EVENT_TRIGGER,
      (spec: TriggerSpec, trigger: Entity, touches: Set<Entity>) => {
        if (spec.type === 'goto') {
          for (const entity of touches) {
            if (entity.hasTrait(PLAYER_TRAIT)) {
              runLevel(spec.name);

              return;
            }
          }
        }
      }
    );

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    const waitScreen = new CompositionScene();
    waitScreen.compositor.addLayer(createColorLayer('#000'));
    waitScreen.compositor.addLayer(dashboardLayer);
    waitScreen.compositor.addLayer(playerProgressLayer);
    sceneRunner.addScene(waitScreen);

    level.compositor.addLayer(createCollisionLayer(level));
    level.compositor.addLayer(dashboardLayer);

    level.tileCollider.addCollisionHandler(new GroundCollisionHandler());
    level.tileCollider.addCollisionHandler(new BrickCollisionHandler());
    level.tileCollider.addCollisionHandler(new CoinCollisionHandler());

    sceneRunner.addScene(level);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        console.log('Animation stopped!');
        cancelAnimationFrame(timer.animationFrameId);
        level.musicController.player?.pauseAll();
      }
    });

    sceneRunner.runNext();
  }
}

const canvasModule = new CanvasModule();
const { canvas } = canvasModule.init('#canvas-container');

const start = () => {
  window.removeEventListener('click', start);
  main(canvas);
};
window.addEventListener('click', start);
