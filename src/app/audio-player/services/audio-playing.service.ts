import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AudioPlaying } from '../interfaces/audio-playing';
import { PlayingSong } from '../interfaces/playing-song';
import { StorageInterface } from '../interfaces/storage.interface';
import { BROWSER_STORAGE } from '../storage-injection-token';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayingService {
  constructor(@Inject(BROWSER_STORAGE) private storage: StorageInterface) {}

  // todo: move property initialization above constructor
  private readonly defaultAudioPlaying: AudioPlaying = {
    idList: 0,
    playPause: {
      isPause: false,
      isPlaying: false,
    },
  };

  audioPlaying =
    this.storage.getItem('audioPlaying') !== null
      ? this.setAudioPlaying()
      : this.defaultAudioPlaying;

  currentAudioPlaying$ = new BehaviorSubject(this.audioPlaying);

  // todo: implement better name for method
  private setAudioPlaying(): AudioPlaying {
    const currentPlayingSong: PlayingSong = JSON.parse(
      this.storage.getItem('audioPlaying') // todo: what will be if audioPlaying key is absent in storage?
    );

    return {
      idList: currentPlayingSong.idList,
      song: currentPlayingSong.song,
      playPause: {
        isPause: false,
        isPlaying: true,
      },
      timestamp: currentPlayingSong.timeStamp,
    };
  }
}
