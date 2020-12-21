import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Song} from './shared/song';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

interface SongsResults {
  results: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private readonly countSongs = 20;

  constructor(private http: HttpClient) {}

  getITunesSongs(): Observable<Song[]> {
    return this.http.get<SongsResults>(environment.itunesUrl).pipe(
      map((songs: SongsResults) => songs.results.slice(1, this.countSongs))
    );
  }
}
