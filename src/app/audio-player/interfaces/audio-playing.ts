import { Song } from './song';
import { StatePlayPause } from './state-play-pause';

export interface AudioPlaying {
  idList: number;
  song?: Song;
  // todo: maybe it would be better to implement enum with audio state (play, pause)
  playPause: StatePlayPause;
  timestamp?: number;
}
