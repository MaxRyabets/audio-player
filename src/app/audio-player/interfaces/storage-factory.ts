export interface StorageFactory {
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  clear(): void;
  key(index: number): string;
  getLength(): number;
}
