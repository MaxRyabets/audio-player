import { StorageFactory } from './interfaces/storage-factory';

export class LocalStorage implements StorageFactory {
  clear(): void {
    localStorage.clear();
  }

  getItem(key: string): string {
    return localStorage.getItem(key);
  }

  getLength(): number {
    return localStorage.length;
  }

  key(index: number): string {
    return localStorage.key(index);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
