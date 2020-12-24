import { InjectionToken } from '@angular/core';
import { StorageFactoryService } from './services/storage-factory.service';
import { LocalStorage } from './local-storage';
import { SessionStorage } from './session-storage';

export const BROWSER_STORAGE = new InjectionToken<
  LocalStorage | SessionStorage
>('Browser Storage', {
  providedIn: 'root',
  factory: () => new StorageFactoryService(sessionStorage).create(),
});
