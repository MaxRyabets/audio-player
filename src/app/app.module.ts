import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioPlayerControlsComponent } from './audio-player/audio-player-controls/audio-player-controls.component';
import { AudioListComponent } from './audio-player/audio-list/audio-list.component';
import { HttpClientModule } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

@NgModule({
  declarations: [AppComponent, AudioPlayerComponent, AudioPlayerControlsComponent, AudioListComponent],
  imports: [BrowserModule, CommonModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
