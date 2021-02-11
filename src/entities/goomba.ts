import { Entity, Trait } from '@nymphajs/core';
import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadSpriteSheet } from '../loaders';
import { Killable, KILLABLE_TRAIT } from '../traits/killable';
import { PendulumMove, PENDULUM_MOVE_TRAIT } from '../traits/pendulum-move';
import { Physics, PHYSICS_TRAIT } from '../traits/physics';
import { SOLID_TRAIT, Solid } from '../traits/solid';
import { STOMPER_TRAIT } from '../traits/stomper';
import { BEHAVIOR_TRAIT } from './constants';

export async function loadGoomba() {
  return loadSpriteSheet('goomba').then(createGoombaFactory);
}

class Behavior extends Trait {
  constructor() {
    super(BEHAVIOR_TRAIT);
  }

  collides(us: Entity, them: Entity) {
    const killable = us.getTrait<Killable>(KILLABLE_TRAIT);
    if (killable.dead) {
      return;
    }

    if (them.hasTrait(STOMPER_TRAIT)) {
      if (them.vel.y > us.vel.y) {
        killable.kill();

        us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).speed = 0;
      } else {
        them.getTrait<Killable>(KILLABLE_TRAIT).kill();
      }
    }
  }
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk');

  function routeAnim(goomba: Entity) {
    if (goomba.getTrait<Killable>(KILLABLE_TRAIT).dead) {
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

    goomba.addTrait(PHYSICS_TRAIT, new Physics());
    goomba.addTrait(SOLID_TRAIT, new Solid());
    goomba.addTrait(PENDULUM_MOVE_TRAIT, new PendulumMove());
    goomba.addTrait(BEHAVIOR_TRAIT, new Behavior());
    goomba.addTrait(KILLABLE_TRAIT, new Killable());

    goomba.draw = (ctx) => drawGoomba(goomba, ctx);

    return goomba;
  };
}
