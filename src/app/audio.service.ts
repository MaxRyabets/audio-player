import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sound } from './shared/sound';
import { SOUNDS } from './shared/mock-sounds';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor(private http: HttpClient) {}

  getITunesSound(): Observable<any> {
    return this.http.get(environment.itunesUrl);
  }

  getSounds(): Observable<Sound[]> {
    return of(SOUNDS);
  }
}
