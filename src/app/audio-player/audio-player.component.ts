import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AudioPlayingService } from './services/audio-playing.service';
import { Observable } from 'rxjs';
import { AudioPlaying } from './interfaces/audio-playing';
import { Song } from './interfaces/song';
import { AudioPlayerService } from './services/audio-player.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent implements OnInit {
  isAudioPlaying$: Observable<boolean>;

  audioPlaying$: Observable<AudioPlaying>;
  songs$: Observable<Song[]>;
  songId: number;

  constructor(
    private audioService: AudioPlayerService,
    private audioPlayingService: AudioPlayingService
  ) {}

  ngOnInit(): void {
    this.setSongs();
    this.setAudioPlaying();
    this.setIsAudioPlaying();
  }

  setNextSong(id: number): void {
    this.songId = id;
  }

  setPrevSong(id: number): void {
    this.songId = id;
  }

  setIsAudioPlaying(): void {
    this.isAudioPlaying$ = this.audioPlayingService.isAudioPlaying();
  }

  private setSongs(): void {
    this.songs$ = this.audioService.getSongs();
  }

  private setAudioPlaying(): void {
    this.audioPlaying$ = this.audioPlayingService.getCurrentAudioPlaying();
  }
}
