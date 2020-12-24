import {Song} from './song';

export interface AudioPlaying {
  idList: number;
  song?: Song;
  isPause: boolean;
  timestamp?: number;
}
