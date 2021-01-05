import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from '../interfaces/song';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { SongAdapterService } from './song-adapter.service';
import { SongModel } from '../song.model';

interface SongsResults {
  results: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private readonly countSongs = 20;

  constructor(
    private http: HttpClient,
    private songAdapterService: SongAdapterService
  ) {}

  // todo: maybe this method should be named getSongs?
  getITunesSongs(): Observable<SongModel[]> {
    return this.http.get<SongsResults>(environment.itunesUrl).pipe(
      // todo: maybe this should be in adapter?
      map((songs: SongsResults) => songs.results.slice(1, this.countSongs)),
      // fixme: you know songs type here, it is not any
      // todo: maybe this part of code should be in adapter?
      map((songs: any[]) =>
        songs.filter((song) => song.hasOwnProperty('previewUrl'))
      ),
      // fixme: you know songs type here, it is not any
      map((songs: any[]) =>
        songs.map((song) => this.songAdapterService.adapt(song))
      )
    );
  }
}
