import { Entity, Trait, Level, GameContext } from '@nymphajs/core';

export const TRIGGER_TRAIT = 'trigger';
export type Condition = (
  entity: Entity,
  touches: Set<Entity>,
  gameContext: GameContext,
  level: Level
) => void;

export class Trigger extends Trait {
  touches = new Set<Entity>();
  conditions: Condition[] = [];

  constructor() {
    super(TRIGGER_TRAIT);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (this.touches.size > 0) {
      for (const condition of this.conditions) {
        condition(entity, this.touches, gameContext, level);
      }

      this.touches.clear();
    }
  }

  collides(_us: Entity, them: Entity) {
    this.touches.add(them);
  }
}
