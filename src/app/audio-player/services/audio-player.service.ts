import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from '../interfaces/song';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { SongAdapterService } from './song-adapter.service';
import { SongModel } from '../interfaces/song-model';
import { SongsResults } from '../interfaces/songs-results';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private readonly countSongs = 20;

  constructor(
    private http: HttpClient,
    private songAdapterService: SongAdapterService
  ) {}

  getSongs(): Observable<SongModel[]> {
    return this.http.get<SongsResults>(environment.itunesUrl).pipe(
      map((songs: SongsResults) =>
        this.songAdapterService.prepareSongs(songs, this.countSongs)
      ),
      map((songs: Song[]) =>
        songs.map((song) => this.songAdapterService.adapt(song))
      )
    );
  }
}
