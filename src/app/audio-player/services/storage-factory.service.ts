import { LocalStorage } from '../local-storage';
import { SessionStorage } from '../session-storage';
import { Injectable } from '@angular/core';

// todo: do you really need this class?
@Injectable({
  providedIn: 'root',
})
export class StorageFactoryService {
  // fixme: add type for parameter
  constructor(private storage) {}

  // fixme: you should return single abstract type (in this case StorageInterface)
  create(): LocalStorage | SessionStorage {
    // todo: it would be better if this.storage = some enum, but not storage itself
    switch (this.storage) {
      case localStorage:
        return new LocalStorage();
      case sessionStorage:
        return new SessionStorage();
    }
  }
}
