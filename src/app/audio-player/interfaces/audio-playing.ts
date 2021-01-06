import { Song } from './song';

export interface AudioPlaying {
  idList: number;
  song?: Song;
  playPause: string;
  timestamp?: number;
}
