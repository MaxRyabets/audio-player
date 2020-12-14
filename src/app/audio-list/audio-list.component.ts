import {Component, OnInit} from '@angular/core';
import {Sound} from '../shared/sound';
import {AudioService} from '../audio.service';
import {tap} from 'rxjs/operators';
import SwiperCore, {Navigation, Pagination} from 'swiper/core';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
})
export class AudioListComponent implements OnInit {
  breakpoints = {
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
      spaceBetween: 0,
      slidesPerGroup: 5
    },
  };

  sounds: Sound[] = [];
  index = 0;

  constructor(private readonly audioService: AudioService) {}

  ngOnInit(): void {
    this.getSounds();

    this.audioService
      .getITunesSound()
      .pipe(
        tap((sounds) => {
          console.log(sounds);
          /*sounds.forEach((sound) => {
            console.log(sound);
            /!*return sound.hasOwnProperty('previewUrl');*!/
          });*/
        })
      )
      .subscribe();
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
