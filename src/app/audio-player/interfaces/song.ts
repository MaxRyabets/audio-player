export interface Song {
  id?: number;
  trackName: string;
  title?: string;
  artistName: string;
  previewUrl?: string;
  src?: string;
  // todo: do you need this option?
  additionalSetting?: string;
}
