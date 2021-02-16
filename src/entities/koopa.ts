import { Entity, GameContext, Trait } from '@nymphajs/core';
import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadSpriteSheet } from '../loaders';
import { Killable, KILLABLE_TRAIT } from '../traits/killable';
import { PendulumMove, PENDULUM_MOVE_TRAIT } from '../traits/pendulum-move';
import { PHYSICS_TRAIT, Physics } from '../traits/physics';
import { SOLID_TRAIT, Solid } from '../traits/solid';
import { STOMPER_TRAIT } from '../traits/stomper';
import { BEHAVIOR_TRAIT } from './constants';

type WalkingState = 'walking' | 'hiding' | 'panic';

export async function loadKoopa() {
  return loadSpriteSheet('koopa').then(createKoopaFactory);
}

class Behavior extends Trait {
  private hideDuration = 5;
  private panicSpeed = 300;
  private walkSpeed: number | null = null;
  hideTime = 0;
  state: WalkingState = 'walking';

  constructor() {
    super(BEHAVIOR_TRAIT);
  }

  update(us: Entity, { deltaTime }: GameContext) {
    if (this.state === 'hiding') {
      this.hideTime += deltaTime;

      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }

  collides(us: Entity, them: Entity) {
    const killable = us.getTrait<Killable>(KILLABLE_TRAIT);
    if (killable.dead) {
      return;
    }

    if (them.hasTrait(STOMPER_TRAIT)) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  private handleStomp(us: Entity, them: Entity) {
    if (this.state === 'walking') {
      this.hide(us);
    } else if (this.state === 'hiding') {
      us.getTrait<Killable>(KILLABLE_TRAIT).kill();
      us.vel.set(100, -200);
      us.getTrait<Solid>(SOLID_TRAIT).obstructs = false;
    } else if (this.state === 'panic') {
      this.hide(us);
    }
  }

  private handleNudge(us: Entity, them: Entity) {
    if (this.state === 'walking') {
      them.getTrait<Killable>(KILLABLE_TRAIT).kill();
    } else if (this.state === 'hiding') {
      this.panic(us, them);
    } else if (this.state === 'panic') {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);
      if (travelDir !== 0 && travelDir !== impactDir) {
        them.getTrait<Killable>(KILLABLE_TRAIT).kill();
      }
    }
  }

  private hide(us: Entity) {
    us.vel.x = 0;
    us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).enabled = false;
    if (this.walkSpeed === null) {
      this.walkSpeed = us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).speed;
    }

    this.state = 'hiding';
    this.hideTime = 0;
  }

  private unhide(us: Entity) {
    us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).enabled = true;
    us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).speed = this.walkSpeed ?? 0;
    this.state = 'walking';
  }

  private panic(us: Entity, them: Entity) {
    us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).enabled = true;
    const speed = this.panicSpeed * Math.sign(them.vel.x);
    us.getTrait<PendulumMove>(PENDULUM_MOVE_TRAIT).speed = speed;
    this.state = 'panic';
  }
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk');
  const wakeAnim = sprite.animations.get('wake');

  function routeAnim(koopa: Entity) {
    const { state, hideTime } = koopa.getTrait<Behavior>(BEHAVIOR_TRAIT);
    if (state === 'hiding') {
      if (hideTime > 3 && wakeAnim) {
        return wakeAnim(hideTime);
      }

      return 'hiding';
    }

    if (state === 'panic') {
      return 'hiding';
    }

    if (walkAnim) {
      return walkAnim(koopa.lifetime);
    }

    return 'walk-1';
  }

  function drawKoopa(koopa: Renderable, context: CanvasRenderingContext2D) {
    if (walkAnim) {
      const args = [context, 0, 0, koopa.vel.x < 0] as const;
      return sprite.draw(routeAnim(koopa), ...args);
    }

    return sprite.draw('walk-1', context, 0, 0);
  }

  return function createKoopa() {
    const koopa = new Renderable();
    koopa.size.set(16, 16);
    koopa.offset.set(0, 8);

    koopa.addTrait(PHYSICS_TRAIT, new Physics());
    koopa.addTrait(SOLID_TRAIT, new Solid());
    koopa.addTrait(PENDULUM_MOVE_TRAIT, new PendulumMove());
    koopa.addTrait(BEHAVIOR_TRAIT, new Behavior());
    koopa.addTrait(KILLABLE_TRAIT, new Killable());
    koopa.draw = (ctx) => drawKoopa(koopa, ctx);

    return koopa;
  };
}
