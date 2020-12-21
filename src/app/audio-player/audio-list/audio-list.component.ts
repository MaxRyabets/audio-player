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
import {Subject} from 'rxjs';
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
    this.isPause = !this.isPause;

    const songWithId: Song = {
      id,
      ...song
    };

    this.currentPlayingSongId = id;
    this.emitSong.emit(songWithId);
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  initSwiper(): void {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      observer: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
          slidesPerGroup: 1
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 30,
          slidesPerGroup: 3
        },
        640: {
          slidesPerView: 5,
          spaceBetween: 30,
          slidesPerGroup: 5
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
}
