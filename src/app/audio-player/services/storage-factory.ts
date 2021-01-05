import { StorageInterface } from '../interfaces/storage.interface';
import { StorageEnum } from '../storage.enum';
import { LocalStorage } from '../local-storage';
import { SessionStorage } from '../session-storage';

export function create(storage): StorageInterface {
  if (storage === StorageEnum.localStorage) {
    return new LocalStorage();
  }

  return new SessionStorage();
}
