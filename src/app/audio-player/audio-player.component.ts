import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AudioPlayingService} from './audio-playing.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AudioPlaying} from './shared/audio-playing';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  audioPlaying: AudioPlaying;
  destroy$ = new Subject();
  songId;

  constructor(
    private cdRef: ChangeDetectorRef,
    private audioPlayingService: AudioPlayingService,
  ) {}

  ngOnInit(): void {
    this.audioPlayingService.currentAudioPlaying$.asObservable().pipe(
      takeUntil(this.destroy$),
      tap((audioPlaying) => this.audioPlaying = audioPlaying)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextTrack(id: number): void {
    this.songId = id;
  }

  prevTrack(id): void {
    this.songId = id;
  }
}
