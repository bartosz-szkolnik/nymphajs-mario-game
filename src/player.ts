import { Entity } from '@nymphajs/core';
import { Renderable } from '@nymphajs/dom-api';
import { Player } from './traits/player';
import { PlayerController } from './traits/player-controller';

export function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.setPlayer(playerEntity);
  playerController.checkpoint.set(64, 64);

  playerEnv.addTrait(playerController);
  return playerEnv;
}

export function makePlayer(entity: Renderable, name: string) {
  const player = new Player();
  player.displayName = name;

  entity.isPlayer = true;
  entity.addTrait(player);
}

export function* findPlayers(entities: Set<Entity>) {
  for (const entity of entities) {
    if (entity.has(Player)) {
      yield entity;
    }
  }
}
