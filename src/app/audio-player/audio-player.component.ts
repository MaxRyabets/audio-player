import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {Sound} from './shared/sound';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent implements OnInit {
  sound: Sound;

  constructor() { }

  ngOnInit(): void {
  }

  getSounds(sound: Sound): void {
    this.sound = sound;
  }
}
