import { Renderable } from '@nymphajs/dom-api';
import { loadBullet } from './entities/bullet';
import { loadGoomba } from './entities/goomba';
import { loadKoopa } from './entities/koopa';
import { loadMario } from './entities/mario';

export type Factory = () => Renderable;

export async function loadEntities(audioContext: AudioContext) {
  const entityFactories: Record<string, Factory> = {};

  function addAs(name: string) {
    return (factory: Factory) => (entityFactories[name] = factory);
  }

  return Promise.all([
    loadMario(audioContext).then(addAs('mario')),
    loadGoomba().then(addAs('goomba')),
    loadKoopa().then(addAs('koopa')),
    loadBullet().then(addAs('bullet')),
  ]).then(() => entityFactories);
}
