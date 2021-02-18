import { MusicPlayer } from '@nymphajs/core';
import { loadJSON } from '@nymphajs/dom-api';

export function loadMusicSheet(name: string) {
  return loadJSON<MusicSheetSpec>(`sounds/${name}`).then((musicSheet) => {
    const musicPlayer = new MusicPlayer();
    for (const [name, track] of Object.entries(musicSheet)) {
      musicPlayer.addTrack(name, track.url);
    }

    return musicPlayer;
  });
}
