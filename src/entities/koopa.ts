import { Entity, GameContext, Trait } from '@nymphajs/core';
import { Renderable, SpriteSheet } from '@nymphajs/dom-api';
import { loadSpriteSheet } from '../loaders/sprite-loader';
import { Killable } from '../traits/killable';
import { PendulumMove } from '../traits/pendulum-move';
import { Physics } from '../traits/physics';
import { Solid } from '../traits/solid';
import { Stomper } from '../traits/stomper';

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

  update(us: Entity, { deltaTime }: GameContext) {
    if (this.state === 'hiding') {
      this.hideTime += deltaTime;

      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }

  collides(us: Entity, them: Entity) {
    const killable = us.get(Killable);
    if (killable.dead) {
      return;
    }

    if (them.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  private handleStomp(us: Entity, _them: Entity) {
    if (this.state === 'walking') {
      this.hide(us);
    } else if (this.state === 'hiding') {
      us.get(Killable).kill();
      us.vel.set(100, -200);

      us.get(Solid).obstructs = false;
    } else if (this.state === 'panic') {
      this.hide(us);
    }
  }

  private handleNudge(us: Entity, them: Entity) {
    if (this.state === 'walking') {
      them.get(Killable).kill();
    } else if (this.state === 'hiding') {
      this.panic(us, them);
    } else if (this.state === 'panic') {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);

      if (travelDir !== 0 && travelDir !== impactDir) {
        them.get(Killable).kill();
      }
    }
  }

  private hide(us: Entity) {
    us.vel.x = 0;
    us.get(PendulumMove).enabled = false;

    if (this.walkSpeed === null) {
      this.walkSpeed = us.get(PendulumMove).speed;
    }

    this.state = 'hiding';
    this.hideTime = 0;
  }

  private unhide(us: Entity) {
    const pendulumMove = us.get(PendulumMove);
    pendulumMove.enabled = true;
    pendulumMove.speed = this.walkSpeed ?? 0;
    this.state = 'walking';
  }

  private panic(us: Entity, them: Entity) {
    const pendulumMove = us.get(PendulumMove);
    pendulumMove.enabled = true;

    const speed = this.panicSpeed * Math.sign(them.vel.x);
    pendulumMove.speed = speed;
    this.state = 'panic';
  }
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk');
  const wakeAnim = sprite.animations.get('wake');

  function routeAnim(koopa: Entity) {
    const { state, hideTime } = koopa.get(Behavior);
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

    koopa.addTrait(new Physics());
    koopa.addTrait(new Solid());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Behavior());
    koopa.addTrait(new Killable());
    koopa.draw = (ctx) => drawKoopa(koopa, ctx);

    return koopa;
  };
}
