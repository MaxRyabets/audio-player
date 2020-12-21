import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Sound} from './shared/sound';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
  sound: Sound;
  currentSoundId;
  isPause;

  constructor(private cdRef: ChangeDetectorRef) {}

  getSounds(sound: Sound): void {
    this.sound = sound;
    this.currentSoundId = undefined;
  }

  nextTrack(): void {
    this.currentSoundId = this.sound.id + 1;
    this.isPause = true;
  }

  prevTrack(): void {
    this.currentSoundId = this.sound.id - 1;
    this.isPause = true;
  }

  isAudioOnPause(isPause: boolean): void {
    this.isPause = isPause;
    this.cdRef.detectChanges();
  }
}
