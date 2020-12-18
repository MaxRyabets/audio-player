import {ChangeDetectionStrategy, Component} from '@angular/core';
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

  getSounds(sound: Sound): void {
    this.sound = sound;
    this.currentSoundId = undefined;
  }

  nextTrack(): void {
    this.currentSoundId = this.sound.id + 1;
  }

  prevTrack(): void {
    this.currentSoundId = this.sound.id - 1;
  }
}
