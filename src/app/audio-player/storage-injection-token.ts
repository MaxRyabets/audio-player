import { InjectionToken } from '@angular/core';
import { StorageFactoryService } from './services/storage-factory.service';
import { LocalStorage } from './local-storage';
import { SessionStorage } from './session-storage';

// todo: read https://angular.io/guide/dependency-injection-providers#using-an-injectiontoken-object and update current realization
// todo: read https://angular.io/guide/dependency-injection-providers#using-factory-providers and update current realization
// fixme: maybe BROWSER storage is not the best name?
export const BROWSER_STORAGE = new InjectionToken<
  LocalStorage | SessionStorage
>('Browser Storage', {
  providedIn: 'root',
  // todo: maybe it will be better to use factory function
  factory: () => new StorageFactoryService(sessionStorage).create(),
});
