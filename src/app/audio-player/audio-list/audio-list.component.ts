import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Song } from '../interfaces/song';
import { AudioPlayerService } from '../services/audio-player.service';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import Swiper from 'swiper';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { AudioPlayingService } from '../services/audio-playing.service';
import { AudioPlaying } from '../interfaces/audio-playing';

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioListComponent implements OnInit, AfterViewInit, OnDestroy {
  songs: Song[] = [];
  isPause = false;
  audioPlaying: AudioPlaying;

  private readonly breakPointSmallWindow = '@0.75';
  private readonly breakPointMiddleWindow = '@1.00';
  private readonly breakPointBigWindow = '@1.50';

  swiper: Swiper;

  private readonly destroy$ = new Subject();

  @ViewChild('swiperContainer') swiperContainer: ElementRef;
  @Input() set songId(songId: number) {
    if (songId === undefined) {
      return;
    }

    this.autoChangeSlide(songId);

    this.setNextPrevSong(songId);
  }

  constructor(
    private audioService: AudioPlayerService,
    private audioPlayingService: AudioPlayingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    SwiperCore.use([Navigation, Pagination]);
  }

  ngOnInit(): void {
    this.getSongs();
    this.audioPlayingService.currentAudioPlaying$
      .asObservable()
      .pipe(
        takeUntil(this.destroy$),
        tap((audioPlaying: AudioPlaying) => {
          this.isPause = audioPlaying.playPause.isPause;
          this.audioPlaying = audioPlaying;

          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.swiper !== undefined),
        tap(() => {
          this.swiper.slideToLoop(this.audioPlaying.song.id);
        })
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
    let isPlaying = this.audioPlaying.playPause.isPlaying;

    if (this.audioPlaying.playPause.isPlaying) {
      isPlaying = false;
    }

    let isPause = this.audioPlaying.playPause.isPause;

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
      playPause: {
        isPause: !isPause,
        isPlaying,
      },
    };

    this.audioPlayingService.currentAudioPlaying$.next(audioPlaying);
  }

  initSwiper(): void {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      loop: true,
      observer: true,
      loopFillGroupWithBlank: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        '@0.75': {
          slidesPerView: 2,
          spaceBetween: 20,
          slidesPerGroup: 2,
        },
        '@1.00': {
          slidesPerView: 3,
          spaceBetween: 30,
          slidesPerGroup: 3,
        },
        '@1.50': {
          slidesPerView: 5,
          spaceBetween: 30,
          slidesPerGroup: 5,
        },
      },
    });
  }

  isActiveSong(songIndex: number): string {
    if (!this.audioPlaying.hasOwnProperty('song')) {
      return 'inactive-image';
    }

    if (
      this.audioPlaying.song.id === songIndex &&
      this.audioPlaying.playPause.isPlaying
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

  private getSongs(): void {
    this.audioService
      .getITunesSongs()
      .pipe(
        takeUntil(this.destroy$),
        tap((songs) => {
          this.songs = songs;
          this.changeDetectorRef.detectChanges();

          this.initSwiper();
        })
      )
      .subscribe();
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
      playPause: {
        isPause: true,
      },
    };

    this.audioPlayingService.currentAudioPlaying$.next(audioPlaying);
  }

  private autoChangeSlide(songId: number): void {
    const currentBreakpoint = this.swiperContainer.nativeElement.swiper
      .currentBreakpoint;
    const slidesPerView = this.swiperContainer.nativeElement.swiper.params
      .slidesPerView;

    if (songId === 0 || this.songs.length === songId) {
      this.swiper.slideToLoop(0);

      return;
    }

    if (songId < 0) {
      this.swiper.slideToLoop(this.songs.length - 1);

      return;
    }

    if (this.isChangeSizeWindow(currentBreakpoint, songId, slidesPerView)) {
      this.swiper.slideToLoop(songId);
      this.swiper.slideNext();
    }

    this.swiper.slideToLoop(songId);
  }

  private isChangeSizeWindow(
    currentBreakpoint: string,
    songId: number,
    slidesPerView: number
  ): boolean {
    return (
      (this.breakPointBigWindow === currentBreakpoint &&
        songId % slidesPerView === 0) ||
      (this.breakPointMiddleWindow === currentBreakpoint &&
        songId % slidesPerView === 0) ||
      this.breakPointSmallWindow === currentBreakpoint
    );
  }
}
