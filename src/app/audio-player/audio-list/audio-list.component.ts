import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { Song } from '../interfaces/song';
import Swiper from 'swiper';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { AudioPlayingService } from '../services/audio-playing.service';
import { AudioPlaying } from '../interfaces/audio-playing';
import { PlayPausePlayed } from '../interfaces/state-play-pause';

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioListComponent implements AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject();
  private localAudioPlaying: AudioPlaying;

  private isPause = false;

  swiper: Swiper;

  @Input() songs: Song[];

  get audioPlaying(): AudioPlaying {
    return this.localAudioPlaying;
  }

  @Input() set audioPlaying(audioPlaying: AudioPlaying) {
    this.localAudioPlaying = audioPlaying;

    this.isPause =
      audioPlaying.playPause !== PlayPausePlayed.Pause &&
      audioPlaying.playPause !== PlayPausePlayed.Played;

    this.changeDetectorRef.detectChanges();
  }

  @Input() set songId(songId: number) {
    if (songId === undefined) {
      return;
    }

    this.autoChangeSlide(songId);

    this.setNextPrevSong(songId);
  }

  constructor(
    private elementRef: ElementRef,
    private audioPlayingService: AudioPlayingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.swiper.hasOwnProperty('clickedSlide')),
        tap(() => this.swiper.slideToLoop(this.audioPlaying.song.id))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index, song): number {
    return song.id;
  }

  onClickSong(id: number, song: Song): void {
    let isPause = this.audioPlaying.playPause === PlayPausePlayed.Play;

    if (
      this.audioPlaying.hasOwnProperty('song') &&
      id !== this.audioPlaying.song.id
    ) {
      isPause = false;
    }

    const audioPlaying: AudioPlaying = {
      ...this.audioPlaying,
      song: {
        id,
        ...song,
      },
      playPause: !isPause ? PlayPausePlayed.Play : PlayPausePlayed.Pause,
    };

    this.audioPlayingService.currentAudioPlaying$.next(audioPlaying);
  }

  isActiveSong(songIndex: number): string {
    if (!this.audioPlaying.hasOwnProperty('song')) {
      return 'inactive-image';
    }

    if (
      this.audioPlaying.song.id === songIndex &&
      this.audioPlaying.playPause === PlayPausePlayed.Played
    ) {
      return 'active-playing';
    }

    return this.audioPlaying.song.id === songIndex && this.isPause
      ? 'active-image'
      : 'inactive-image';
  }

  isClickedSong(index: number): boolean {
    if (!this.audioPlaying.hasOwnProperty('song')) {
      return;
    }

    return this.audioPlaying.song.id === index && this.isPause;
  }

  private setNextPrevSong(songId: number): void {
    let song: Song;
    const songsLength = this.songs.length;
    let id = songId;

    if (songsLength === songId) {
      id = 0;
    }

    if (songId < 0) {
      id = songsLength - 1;
    }

    song = this.songs[id];

    const audioPlaying: AudioPlaying = {
      ...this.audioPlaying,
      song: {
        id,
        ...song,
      },
      playPause: PlayPausePlayed.Play,
    };

    this.audioPlayingService.currentAudioPlaying$.next(audioPlaying);
  }

  private autoChangeSlide(songId: number): void {
    if (songId === 0 || this.songs.length === songId) {
      this.swiper.slideToLoop(0);

      return;
    }

    if (songId < 0) {
      this.swiper.slideToLoop(this.songs.length - 1);

      return;
    }

    this.swiper.slideToLoop(songId);
  }

  getSwiper(swiper: Swiper): void {
    this.swiper = swiper;
  }
}
