import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioPlaying } from '../interfaces/audio-playing';
import { PlayingSong } from '../interfaces/playing-song';
import { map } from 'rxjs/operators';
import { APP_CONFIG_STORAGE } from '../../app.config';
import { PlayPausePlayed } from '../interfaces/state-play-pause';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayingService {
  private readonly defaultAudioPlaying: AudioPlaying = {
    idList: 0,
    playPause: PlayPausePlayed.Pause,
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
    if (PlayPausePlayed.Pause) {
      return this.getCurrentAudioPlaying().pipe(
        map((audioPlaying: AudioPlaying) => {
          return audioPlaying.hasOwnProperty('song');
        })
      );
    }
  }

  private getAudioPlaying(): AudioPlaying {
    const currentPlayingSong: PlayingSong = JSON.parse(
      this.config.storage.getItem('audioPlaying')
    );

    return {
      idList: currentPlayingSong.idList,
      song: currentPlayingSong.song,
      playPause: PlayPausePlayed.Played,
      timestamp: currentPlayingSong.timeStamp,
    };
  }
}
