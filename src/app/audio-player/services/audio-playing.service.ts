import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioPlaying } from '../interfaces/audio-playing';
import { PlayingSong } from '../interfaces/playing-song';
import { map } from 'rxjs/operators';
import { APP_CONFIG_STORAGE } from '../../app.config';

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
    this.config.storage.getItem('audioPlaying') !== null
      ? this.getAudioPlaying()
      : this.defaultAudioPlaying;

  currentAudioPlaying$ = new BehaviorSubject(this.audioPlaying);

  constructor(@Inject(APP_CONFIG_STORAGE) private config) {}

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
      this.config.storage.getItem('audioPlaying')
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
