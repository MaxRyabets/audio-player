import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Sound} from '../shared/sound';

@Component({
  selector: 'app-audio-players-controls',
  templateUrl: './audio-player-controls.component.html',
  styleUrls: ['./audio-player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerControlsComponent implements OnInit {
  currentSounds: Sound[] = [];

  @Input() set sounds(sounds: Sound[]) {
   this.currentSounds = sounds;
  }

  constructor() { }

  ngOnInit(): void {

  }

}
