import { InjectionToken } from '@angular/core';
import { LocalStorage } from './audio-player/local-storage';
import { SessionStorage } from './audio-player/session-storage';
import { create } from './audio-player/services/storage-factory';

export const STORAGE_CONFIG = {
  storage: create('sessionStorage'),
};

export const APP_CONFIG_STORAGE = new InjectionToken<
  LocalStorage | SessionStorage
>('app.config');
