import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Sound} from './shared/sound';
import {SOUNDS} from './shared/mock-sounds';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {debounce, debounceTime, delay, map, tap} from 'rxjs/operators';

interface SoundsResults {
  results: Sound[];
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly countSounds = 15;

  constructor(private http: HttpClient) {}

  getITunesSound(): Observable<Sound[]> {
    return this.http.get<SoundsResults>(environment.itunesUrl).pipe(
      map((sounds: SoundsResults) => sounds.results.slice(1, this.countSounds))
    );
  }

  getSounds(): Observable<Sound[]> {
    return of(SOUNDS);
  }
}
