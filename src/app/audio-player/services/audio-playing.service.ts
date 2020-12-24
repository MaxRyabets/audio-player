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

  private readonly defaultAudioPlaying: AudioPlaying = {
    idList: 0,
    isPause: false,
  };

  audioPlaying =
    this.storage.getItem('audioPlaying') !== null
      ? this.setAudioPlaying()
      : this.defaultAudioPlaying;

  currentAudioPlaying$ = new BehaviorSubject(this.audioPlaying);

  private setAudioPlaying(): AudioPlaying {
    const currentPlayingSong: PlayingSong = JSON.parse(
      this.storage.getItem('audioPlaying')
    );

    return {
      idList: currentPlayingSong.idList,
      song: currentPlayingSong.song,
      isPause: true,
      timestamp: currentPlayingSong.timeStamp,
    };
  }
}
