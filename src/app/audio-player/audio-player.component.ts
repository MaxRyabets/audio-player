import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AudioPlayingService } from './services/audio-playing.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AudioPlaying } from './interfaces/audio-playing';
import { Song } from './interfaces/song';
import { AudioPlayerService } from './services/audio-player.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  audioPlaying: AudioPlaying;
  songs$: Observable<Song[]>;
  songId: number;

  constructor(
    private audioService: AudioPlayerService,
    private changeDetectorRef: ChangeDetectorRef,
    private audioPlayingService: AudioPlayingService
  ) {}

  ngOnInit(): void {
    this.setSongs();
    this.setAudioPlaying();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setSongs(): void {
    this.songs$ = this.audioService.getITunesSongs();
  }

  setNextSong(id: number): void {
    this.songId = id;
  }

  setPrevSong(id: number): void {
    this.songId = id;
  }

  isHasPropertySong(): boolean {
    return this.audioPlaying.hasOwnProperty('song');
  }

  private setAudioPlaying(): void {
    this.audioPlayingService.currentAudioPlaying$
      .asObservable()
      .pipe(
        takeUntil(this.destroy$),
        tap((audioPlaying) => {
          this.audioPlaying = audioPlaying;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }
}
