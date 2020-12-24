import { Injectable } from '@angular/core';
import {SongAdapter} from './song-adapter';
import {SongModel} from './song.model';

@Injectable({
  providedIn: 'root'
})
export class SongAdapterService implements SongAdapter<SongModel>{

  adapt(item: any): SongModel {
    return new SongModel(item.trackName, item.artistName, item.previewUrl);
  }
}
