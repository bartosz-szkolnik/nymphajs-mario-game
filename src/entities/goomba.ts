import { Entity, Trait } from '@nymphajs/core';
import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadSpriteSheet } from '../loaders/sprite-loader';
import { Killable } from '../traits/killable';
import { PendulumMove } from '../traits/pendulum-move';
import { Physics } from '../traits/physics';
import { Solid } from '../traits/solid';
import { Stomper } from '../traits/stomper';

export async function loadGoomba() {
  return loadSpriteSheet('goomba').then(createGoombaFactory);
}

class Behavior extends Trait {
  collides(us: Entity, them: Entity) {
    const killable = us.get(Killable);
    if (killable.dead) {
      return;
    }

    if (them.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        killable.kill();

        us.get(PendulumMove).speed = 0;
      } else {
        them.get(Killable).kill();
      }
    }
  }
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk');

  function routeAnim(goomba: Entity) {
    if (goomba.get(Killable).dead) {
      return 'flat';
    }

    if (walkAnim) {
      return walkAnim(goomba.lifetime);
    }

    return 'walk-1';
  }

  function drawGoomba(goomba: Renderable, context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(goomba), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Renderable();
    goomba.size.set(16, 16);

    goomba.addTrait(new Physics());
    goomba.addTrait(new Solid());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new Behavior());
    goomba.addTrait(new Killable());

    goomba.draw = (ctx) => drawGoomba(goomba, ctx);

    return goomba;
  };
}
