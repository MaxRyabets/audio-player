import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Sound} from './shared/sound';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {map} from 'rxjs/operators';

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
}
