// fixme: implement better name for storage interface, storage interface is not factory
export interface StorageFactory {
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  clear(): void;
  key(index: number): string;
  // todo: maybe length: number will be enough?
  getLength(): number;
}
