import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Song} from '../shared/song';
import {AudioPlayerService} from '../audio-player.service';
import SwiperCore, {Navigation, Pagination} from 'swiper/core';
import Swiper from 'swiper';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioListComponent implements OnInit, AfterViewInit, OnDestroy {
  songs: Song[] = [];
  currentPlayingSongId;
  isPause = false;
  readonly breakPointSmallWindow = '@0.75';
  readonly breakPointMiddleWindow = '@1.00';
  readonly breakPointBigWindow = '@1.50';

  destroy$ = new Subject();

  @ViewChild('swiperContainer') swiperContainer: ElementRef;
  @Output() emitSong = new EventEmitter<Song>();

  @Input() set shouldPause(isPause: boolean) {
    this.isPause = isPause;
  }

  @Input() set currentSongId(songId: number) {
    if (songId === undefined) {
      return;
    }

    this.emitNewSong(songId);

    this.autoChangeSlide(songId);
  }

  swiper: Swiper;

  constructor(
    private readonly audioService: AudioPlayerService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSongs();
  }

  trackByFn(index, song): number {
    return song.id;
  }

  onClickSong(id: number, song: Song): void {
    this.setPause(id);

    const songWithId: Song = {
      id,
      ...song
    };

    this.currentPlayingSongId = id;
    this.emitSong.emit(songWithId);
  }

  private setPause(id: number): void {
    if (id !== this.currentPlayingSongId) {
      this.isPause = true;

      return;
    }

    this.isPause = !this.isPause;
  }

  initSwiper(): void {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      loop: true,
      observer: true,
      loopFillGroupWithBlank: true,
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
      }
    });
  }

  isActiveSong(songIndex: number): string {
    return this.currentPlayingSongId === songIndex && this.isPause ? 'active-image' : 'inactive-image';
  }

  isClickedSong(index: number): boolean {
    return this.currentPlayingSongId === index && this.isPause;
  }

  ngAfterViewInit(): void {
    fromEvent(this.swiperContainer.nativeElement, 'resize').pipe(
      tap(console.log)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSongs(): void {
    this.audioService.getITunesSongs().pipe(
      takeUntil(this.destroy$),
      tap(songs => {
        this.songs = songs;
        this.cdRef.detectChanges();

        this.initSwiper();
      })
    ).subscribe();
  }

  private emitNewSong(songId: number): void {
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

    const songWithId: Song = {
      id,
      ...song
    };

    this.currentPlayingSongId = id;
    this.emitSong.emit(songWithId);
  }

  private autoChangeSlide(songId: number): void {
    const currentBreakpoint = this.swiperContainer.nativeElement.swiper.currentBreakpoint;
    const slidesPerView = this.swiperContainer.nativeElement.swiper.params.slidesPerView;

    if (this.isChangeSizeWindow(currentBreakpoint, songId, slidesPerView)) {
      this.swiper.slideToLoop(songId);
    }

    if (this.songs.length === songId) {
      this.swiper.slideToLoop(0);
    }

    if (songId < 0) {
      this.swiper.slideToLoop(this.songs.length - 1);
    }
  }

  private isChangeSizeWindow(currentBreakpoint: string, songId: number, slidesPerView: number): boolean {
    return this.breakPointBigWindow === currentBreakpoint && songId % slidesPerView === 0
      || this.breakPointMiddleWindow === currentBreakpoint && songId % slidesPerView === 0
      || this.breakPointSmallWindow === currentBreakpoint;
  }
}
