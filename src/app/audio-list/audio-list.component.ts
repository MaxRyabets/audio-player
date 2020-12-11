import { Component, OnInit } from '@angular/core';
import { Sound } from '../shared/sound';
import { AudioService } from '../audio.service';
import { tap } from 'rxjs/operators';
import Swiper from 'swiper';

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
    console.log('sounds', this.sounds);
  }

  private getSounds(): void {
    this.audioService
      .getSounds()
      .pipe(tap((sounds: Sound[]) => (this.sounds = sounds)))
      .subscribe();
  }
}
