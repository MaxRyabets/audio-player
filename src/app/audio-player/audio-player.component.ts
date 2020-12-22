import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Song} from './shared/song';
import {AudioSettingsService} from './audio-settings.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
  song: Song;
  currentSongId;

  constructor(
    private cdRef: ChangeDetectorRef,
    private audioSettingsService: AudioSettingsService,
  ) {}

  getSong(song: Song): void {
    this.song = song;
    this.currentSongId = undefined;
  }

  nextTrack(): void {
    this.currentSongId = this.song.id + 1;
    this.audioSettingsService.statePause$.next(true);
  }

  prevTrack(): void {
    this.currentSongId = this.song.id - 1;
    this.audioSettingsService.statePause$.next(true);
  }
}
