import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Song} from './shared/song';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {SongAdapterService} from './song-adapter.service';
import {SongModel} from './song.model';

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
    private songAdapterService: SongAdapterService,
  ) {}

  getITunesSongs(): Observable<SongModel[]> {
    return this.http.get<SongsResults>(environment.itunesUrl).pipe(
      map((songs: SongsResults) => songs.results.slice(1, this.countSongs)),
      map((songs: any[]) => songs.filter(song => song.hasOwnProperty('previewUrl'))),
      map((songs: any[]) => songs.map(song => this.songAdapterService.adapt(song))),
    );
  }
}
