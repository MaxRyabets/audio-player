import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Song} from './shared/song';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
  song: Song;
  currentSongId;
  isPause;

  constructor(private cdRef: ChangeDetectorRef) {}

  getSong(song: Song): void {
    this.song = song;
    this.currentSongId = undefined;
  }

  nextTrack(): void {
    this.currentSongId = this.song.id + 1;
    this.isPause = true;
  }

  prevTrack(): void {
    this.currentSongId = this.song.id - 1;
    this.isPause = true;
  }

  isAudioOnPause(isPause: boolean): void {
    this.isPause = isPause;
    this.cdRef.detectChanges();
  }
}
