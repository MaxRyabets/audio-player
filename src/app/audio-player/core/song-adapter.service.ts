import { Injectable } from '@angular/core';
import {Adapter} from './adapter';
import {SongModel} from './song.model';

@Injectable({
  providedIn: 'root'
})
export class SongAdapterService implements Adapter<SongModel>{

  adapt(item: any): SongModel {
    return new SongModel(item.trackName, item.artistName, item.previewUrl);
  }
}
