import { Entity, GameContext, Level, Trait } from '@nymphajs/core';
import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadSpriteSheet } from '../loaders';
import { Gravity } from '../traits/gravity';
import { Killable, KILLABLE_TRAIT } from '../traits/killable';
import { STOMPER_TRAIT } from '../traits/stomper';
import { Velocity, VELOCITY_TRAIT } from '../traits/velocity';
import { BEHAVIOR_TRAIT } from './constants';

export async function loadBullet() {
  return loadSpriteSheet('bullet').then(createBulletFactory);
}

class Behavior extends Trait {
  private gravity = new Gravity();

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
        us.vel.set(100, -200);
      } else {
        them.getTrait<Killable>(KILLABLE_TRAIT).kill();
      }
    }
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (entity.getTrait<Killable>(KILLABLE_TRAIT).dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(sprite: SpriteSheet) {
  function drawBullet(bullet: Renderable, context: CanvasRenderingContext2D) {
    sprite.draw('bullet', context, 0, 0);
  }

  return function createBullet() {
    const bullet = new Renderable();
    bullet.size.set(16, 14);
    bullet.vel.set(80, 0);

    bullet.addTrait(VELOCITY_TRAIT, new Velocity());
    bullet.addTrait(BEHAVIOR_TRAIT, new Behavior());
    bullet.addTrait(KILLABLE_TRAIT, new Killable());

    bullet.draw = (ctx) => drawBullet(bullet, ctx);

    return bullet;
  };
}
