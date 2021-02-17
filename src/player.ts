import { Entity, Level } from '@nymphajs/core';
import { Renderable } from '@nymphajs/dom-api';
import { Player, PLAYER_TRAIT } from './traits/player';
import {
  PlayerController,
  PLAYER_CONTROLLER_TRAIT,
} from './traits/player-controller';

export function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.setPlayer(playerEntity);
  playerController.checkpoint.set(64, 64);

  playerEnv.addTrait(PLAYER_CONTROLLER_TRAIT, playerController);
  return playerEnv;
}

export function createPlayer(entity: Renderable) {
  entity.addTrait(PLAYER_TRAIT, new Player());
  return entity;
}

export function* findPlayers(level: Level) {
  for (const entity of level.entities) {
    if (entity.hasTrait(PLAYER_TRAIT)) {
      yield entity;
    }
  }
}
