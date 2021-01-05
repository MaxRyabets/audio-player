// todo: why do you have 2 same interfaces with different names?
export interface StorageInterface {
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  clear(): void;
  key(index: number): string;
  // todo: maybe length: number will be enough?
  getLength(): number;
}
