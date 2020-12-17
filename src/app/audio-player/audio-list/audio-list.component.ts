import {AfterViewInit, Component, ElementRef, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {Sound} from '../shared/sound';
import {AudioPlayerService} from '../audio-player.service';
import SwiperCore, {Navigation, Pagination} from 'swiper/core';
import Swiper from 'swiper';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
})
export class AudioListComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer: ElementRef;
  @Output() sounds = new EventEmitter<Sound[]>();

  sounds$: Observable<Sound[]>;
  index = 0;
  swiper: Swiper;

  constructor(private readonly audioService: AudioPlayerService) {}

  ngOnInit(): void {
    this.getSounds();
  }

  trackByFn(index, sound): number {
    return sound.id;
  }

  private getSounds(): void {
    this.sounds$ = this.audioService.getITunesSound().pipe(
      tap(sounds => this.sounds.emit(sounds))
    );
  }

  ngAfterViewInit(): void {
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
}
