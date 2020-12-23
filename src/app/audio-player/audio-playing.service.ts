import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AudioPlaying} from './shared/audio-playing';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayingService {
  private readonly audioPlaying: AudioPlaying = {
    idList: 0,
    isPause: false,
  };

  currentAudioPlaying$ = new BehaviorSubject(this.audioPlaying);
}
