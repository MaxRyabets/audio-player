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
import {Sound} from '../shared/sound';
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
  sounds: Sound[] = [];
  currentPlayingSongId;
  isPause = false;

  destroy$ = new Subject();

  @ViewChild('swiperContainer') swiperContainer: ElementRef;
  @Output() emitSound = new EventEmitter<Sound>();

  @Input() set shouldPause(isPause: boolean) {
    this.isPause = isPause;
  }

  @Input() set currentSoundId(soundId: number) {
    if (soundId === undefined) {
      return;
    }

    this.emitNewSound(soundId);
  }

  swiper: Swiper;

  constructor(
    private readonly audioService: AudioPlayerService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSounds();
  }

  trackByFn(index, sound): number {
    return sound.id;
  }

  onClickSound(id: number, sound: Sound): void {
    this.isPause = !this.isPause;

    const soundWithId: Sound = {
      id,
      ...sound
    };

    this.currentPlayingSongId = id;
    this.emitSound.emit(soundWithId);
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

  isActiveSound(soundIndex: number): string {
    return this.currentPlayingSongId === soundIndex && this.isPause ? 'active-image' : 'inactive-image';
  }

  isClickedSound(index: number): boolean {
    return this.currentPlayingSongId === index && this.isPause;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSounds(): void {
    this.audioService.getITunesSound().pipe(
      takeUntil(this.destroy$),
      tap(sounds => {
        this.sounds = sounds;
        this.cdRef.detectChanges();
      })
    ).subscribe();
  }

  private emitNewSound(soundId: number): void {
    let sound: Sound;
    const soundsLength = this.sounds.length;
    let id = soundId;

    if (soundsLength === soundId) {
      id = 0;
    }

    if (soundId < 0) {
      id = soundsLength - 1;
    }

    sound = this.sounds[id];

    const soundWithId: Sound = {
      id,
      ...sound
    };

    this.currentPlayingSongId = id;
    this.emitSound.emit(soundWithId);
  }
}
