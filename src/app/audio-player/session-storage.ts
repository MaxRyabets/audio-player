import { StorageFactory } from './interfaces/storage-factory';

export class SessionStorage implements StorageFactory {
  clear(): void {
    sessionStorage.clear();
  }

  getItem(key: string): string {
    return sessionStorage.getItem(key);
  }

  getLength(): number {
    return sessionStorage.length;
  }

  key(index: number): string {
    return sessionStorage.key(index);
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
}
