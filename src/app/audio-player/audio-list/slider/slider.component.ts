import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import Swiper from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements AfterViewInit {
  @Output() emitSwiper = new EventEmitter<Swiper>();

  constructor(private elementRef: ElementRef) {
    SwiperCore.use([Navigation, Pagination]);
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  initSwiper(): void {
    const swiper = new Swiper(this.elementRef.nativeElement, {
      loop: true,
      observer: true,
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        576: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1199: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      },
    });

    this.emitSwiper.emit(swiper);
  }
}
