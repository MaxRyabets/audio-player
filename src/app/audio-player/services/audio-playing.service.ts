import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioPlaying } from '../interfaces/audio-playing';
import { PlayingSong } from '../interfaces/playing-song';
import { StorageInterface } from '../interfaces/storage.interface';
import { BROWSER_STORAGE } from '../storage-injection-token';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayingService {
  private readonly defaultAudioPlaying: AudioPlaying = {
    idList: 0,
    playPause: {
      isPause: false,
      isPlaying: false,
    },
  };

  private audioPlaying =
    this.storage.getItem('audioPlaying') !== null
      ? this.getAudioPlaying()
      : this.defaultAudioPlaying;

  currentAudioPlaying$ = new BehaviorSubject(this.audioPlaying);

  constructor(@Inject(BROWSER_STORAGE) private storage: StorageInterface) {}

  getCurrentAudioPlaying(): Observable<AudioPlaying> {
    return this.currentAudioPlaying$.asObservable();
  }

  isAudioPlaying(): Observable<boolean> {
    return this.getCurrentAudioPlaying().pipe(
      map((audioPlaying: AudioPlaying) => {
        return audioPlaying.hasOwnProperty('song');
      })
    );
  }

  private getAudioPlaying(): AudioPlaying {
    const currentPlayingSong: PlayingSong = JSON.parse(
      this.storage.getItem('audioPlaying')
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
