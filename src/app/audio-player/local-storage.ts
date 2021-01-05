import { StorageInterface } from './interfaces/storage.interface';

export class LocalStorage implements StorageInterface {
  clear(): void {
    localStorage.clear();
  }

  getItem(key: string): string {
    return localStorage.getItem(key);
  }

  length(): number {
    return localStorage.length;
  }

  key(index: number): string {
    return localStorage.key(index);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
