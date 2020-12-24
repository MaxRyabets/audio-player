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

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioListComponent implements OnInit, AfterViewInit, OnDestroy {
  songs: Song[] = [];
  currentSongId;
  isPause = false;
  audioPlaying: AudioPlaying;

  readonly breakPointSmallWindow = '@0.75';
  readonly breakPointMiddleWindow = '@1.00';
  readonly breakPointBigWindow = '@1.50';

  swiper: Swiper;

  destroy$ = new Subject();

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
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSongs();
    this.audioPlayingService.currentAudioPlaying$
      .asObservable()
      .pipe(
        takeUntil(this.destroy$),
        tap((audioPlaying: AudioPlaying) => {
          this.isPause = audioPlaying.isPause;
          this.audioPlaying = audioPlaying;

          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  trackByFn(index, song): number {
    return song.id;
  }

  onClickSong(id: number, song: Song): void {
    if (
      this.audioPlaying.hasOwnProperty('song') &&
      id !== this.audioPlaying.song.id
    ) {
      this.audioPlaying.isPause = false;
      this.audioPlayingService.currentAudioPlaying$.next(this.audioPlaying);
    }

    this.currentSongId = id;

    const audioPlaying = {
      ...this.audioPlaying,
      song: {
        id,
        ...song,
      },
      isPause: !this.isPause,
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

  ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.swiper.clickedSlide !== undefined),
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

  private getSongs(): void {
    this.audioService
      .getITunesSongs()
      .pipe(
        takeUntil(this.destroy$),
        tap((songs) => {
          this.songs = songs;
          this.cdRef.detectChanges();

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

    const audioPlaying = {
      ...this.audioPlaying,
      song: {
        id,
        ...song,
      },
      isPause: true,
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
