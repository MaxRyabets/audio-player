import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sound } from './shared/sound';
import { SOUNDS } from './shared/mock-sounds';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  getSounds(): Observable<Sound[]> {
    return of(SOUNDS);
  }
}
