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
  private readonly destroy$ = new Subject();

  private localSongs: Song[] = [];
  private localAudioPlaying: AudioPlaying;

  private isPause = false;

  private swiper: Swiper;

  @ViewChild('swiperContainer') swiperContainer: ElementRef;

  get audioPlaying(): AudioPlaying {
    return this.localAudioPlaying;
  }

  @Input() set audioPlaying(audioPlaying: AudioPlaying) {
    this.localAudioPlaying = audioPlaying;
    this.isPause = audioPlaying.playPause.isPause;

    this.changeDetectorRef.detectChanges();
  }

  get songs(): Song[] {
    return this.localSongs;
  }

  @Input() set songs(songs: Song[]) {
    this.localSongs = songs;
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
    private audioService: AudioPlayerService,
    private audioPlayingService: AudioPlayingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    SwiperCore.use([Navigation, Pagination]);
  }

  ngOnInit(): void {
    this.initSwiper();
  }

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
}
