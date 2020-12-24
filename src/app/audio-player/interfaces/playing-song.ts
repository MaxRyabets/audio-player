import { Song } from './song';

export interface PlayingSong {
  idList: number;
  song: Song;
  timeStamp: number;
}
