import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AudioPlayingService } from './services/audio-playing.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
  songs: Song[] = [];
  // fixme: what is the type of songId
  songId;

  constructor(
    private audioService: AudioPlayerService,
    private changeDetectorRef: ChangeDetectorRef,
    private audioPlayingService: AudioPlayingService
  ) {}

  ngOnInit(): void {
    this.getSongs();
    this.setAudioPlaying();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // todo: rename method, get - should return something
  // todo: do you really need method for this action?
  private getSongs(): void {
    this.audioService
      .getITunesSongs()
      .pipe(
        takeUntil(this.destroy$),
        tap((songs) => {
          this.songs = songs;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  // todo: it looks like set song id method
  nextSong(id: number): void {
    this.songId = id;
  }

  // todo: what is the type of id?
  // todo: it looks like set song id method
  prevSong(id): void {
    this.songId = id;
  }

  isHasPropertySong(): boolean {
    return this.audioPlaying.hasOwnProperty('song');
  }

  // todo: do you really need method for this action?
  private setAudioPlaying(): void {
    this.audioPlayingService.currentAudioPlaying$.asObservable() // todo: maybe you should encapsulate this part in service?
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
