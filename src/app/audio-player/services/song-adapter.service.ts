import { Injectable } from '@angular/core';
import { SongAdapter } from '../interfaces/song-adapter';
import { SongModel } from '../song.model';

@Injectable({
  providedIn: 'root',
})
export class SongAdapterService implements SongAdapter<SongModel> {
  // fixme: item is not any, you know alread that it should have trackName, artistName and previewUrl
  adapt(item: any): SongModel {
    return new SongModel(item.trackName, item.artistName, item.previewUrl);
  }
}
