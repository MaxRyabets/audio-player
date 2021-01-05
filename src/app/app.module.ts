import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioPlayerControlsComponent } from './audio-player/audio-player-controls/audio-player-controls.component';
import { AudioListComponent } from './audio-player/audio-list/audio-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { SliderComponent } from './audio-player/audio-list/slider/slider.component';
import { APP_CONFIG_STORAGE, STORAGE_CONFIG } from './app.congif';

@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    AudioPlayerControlsComponent,
    AudioListComponent,
    SliderComponent,
  ],
  imports: [BrowserModule, CommonModule, HttpClientModule],
  providers: [{ provide: APP_CONFIG_STORAGE, useValue: STORAGE_CONFIG }],
  bootstrap: [AppComponent],
})
export class AppModule {}
