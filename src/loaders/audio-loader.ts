import { AudioBoard } from '@nymphajs/core';
import { loadJSON } from '@nymphajs/dom-api';

export function loadAudioBoard(name: string, audioContext: AudioContext) {
  const loadAudio = createAudioLoader(audioContext);

  return loadJSON<AudioSheetSpec>(`sounds/${name}`).then((audioSheet) => {
    const audioBoard = new AudioBoard();
    const fx = audioSheet.fx;

    const promises = Object.keys(fx).map((name) => {
      const url = fx[name].url;
      return loadAudio(url).then((buffer) => {
        audioBoard.addAudio(name, buffer);
      });
    });

    return Promise.all(promises).then(() => audioBoard);
  });
}

export function createAudioLoader(context: AudioContext) {
  return async function loadAudio(url: string) {
    const response = await fetch(`assets/${url}`);
    const arrayBuffer = await response.arrayBuffer();

    return context.decodeAudioData(arrayBuffer);
  };
}
