import { Song } from './song';
import { StatePlayPause } from './state-play-pause';

export interface AudioPlaying {
  idList: number;
  song?: Song;
  playPause: StatePlayPause;
  timestamp?: number;
}
