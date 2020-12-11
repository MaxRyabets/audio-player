import { Component, OnInit } from '@angular/core';
import { Sound } from '../shared/sound';
import { AudioService } from '../audio.service';
import { tap } from 'rxjs/operators';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
})
export class AudioListComponent implements OnInit {
  sounds: Sound[] = [];
  index = 0;

  constructor(private readonly audioService: AudioService) {}

  ngOnInit(): void {
    this.getSounds();
  }

  onSwiper(swiper): void {
    console.log(swiper);
  }
  onSlideChange(): void {
    console.log('slide change');
  }

  trackByFn(index, item): number {
    return item.id;
  }

  private getSounds(): void {
    this.audioService
      .getSounds()
      .pipe(tap((sounds: Sound[]) => (this.sounds = sounds)))
      .subscribe();
  }
}
