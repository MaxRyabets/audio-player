import { Component, OnInit } from '@angular/core';
import { SLIDES } from '../shared/mock-slides';

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
})
export class AudioListComponent implements OnInit {
  slides = SLIDES;
  index = 0;

  constructor() {}

  ngOnInit(): void {}
}
