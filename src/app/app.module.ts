import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { AudioListComponent } from './audio-list/audio-list.component';
import { SwiperModule } from 'swiper/angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, AudioPlayerComponent, AudioListComponent],
  imports: [BrowserModule, HttpClientModule, SwiperModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
