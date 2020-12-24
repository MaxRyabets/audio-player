import { Injectable } from '@angular/core';
import {StorageInterface} from './shared/storage.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageInterface {

  private storage: Storage = sessionStorage;

  getItem(key: string): string {
    return 'getItem' in this.storage ? this.storage.getItem(key) : null;
  }

  setItem(key: string, value: string): void {
    if ('setItem' in this.storage) {
      this.storage.setItem(key, value);
    }
  }

  key(index: number): string {
    return 'key' in this.storage ? this.storage.key(index) : null;
  }

  clear(): void {
    if ('clear' in this.storage) {
      this.storage.clear();
    }
  }

}
