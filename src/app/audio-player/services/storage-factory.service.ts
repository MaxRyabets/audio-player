import { LocalStorage } from '../local-storage';
import { SessionStorage } from '../session-storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageFactoryService {
  constructor(private storage) {}

  create(): LocalStorage | SessionStorage {
    switch (this.storage) {
      case localStorage:
        return new LocalStorage();
      case sessionStorage:
        return new SessionStorage();
    }
  }
}
