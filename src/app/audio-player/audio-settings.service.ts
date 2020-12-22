import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioSettingsService {

  statePause$ = new BehaviorSubject(false);

  /*private shouldPause = false;

  get isPause(): boolean {
    return this.shouldPause;
  }

  set isPause(isPause: boolean) {
    this.shouldPause = isPause;
  }*/
}
