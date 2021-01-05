import { StorageInterface } from './interfaces/storage.interface';

export class SessionStorage implements StorageInterface {
  clear(): void {
    sessionStorage.clear();
  }

  getItem(key: string): string {
    return sessionStorage.getItem(key);
  }

  length(): number {
    return sessionStorage.length;
  }

  key(index: number): string {
    return sessionStorage.key(index);
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
}
