import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AudioPlaying} from './shared/audio-playing';
import {PlayingSong} from './playing-song';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayingService {

  constructor(private storageService: StorageService) {}

  private readonly defaultAudioPlaying: AudioPlaying = {
    idList: 0,
    isPause: false,
  };

  audioPlaying = this.storageService.getItem('audioPlaying') !== null ?
    this.setAudioPlaying() : this.defaultAudioPlaying;

  currentAudioPlaying$ = new BehaviorSubject(this.defaultAudioPlaying);

  private setAudioPlaying(): AudioPlaying {
    const currentPlayingSong: PlayingSong = JSON.parse(this.storageService.getItem('audioPlaying'));

    return {
      idList: currentPlayingSong.idList,
      isPause: true,
      timestamp: currentPlayingSong.timeStamp
    };
  }
}
