import { Injectable } from '@angular/core';
import { SongAdapter } from '../interfaces/song-adapter';
import { SongModel } from '../interfaces/song-model';
import { Song } from '../interfaces/song';
import { map } from 'rxjs/operators';
import { SongsResults } from '../interfaces/songs-results';

@Injectable({
  providedIn: 'root',
})
export class SongAdapterService implements SongAdapter<SongModel> {
  adapt({ trackName, artistName, previewUrl }: Song): SongModel {
    return {
      trackName,
      artistName,
      previewUrl,
    };
  }

  prepareSongs(songs: SongsResults, countSongs: number): Song[] {
    const songsSliceFirst = songs.results.slice(1, countSongs);

    return songsSliceFirst.filter((song) => song.hasOwnProperty('previewUrl'));
  }
}
