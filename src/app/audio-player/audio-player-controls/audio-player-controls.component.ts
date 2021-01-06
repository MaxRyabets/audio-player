import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Timestamp } from './timestamp';
import { AudioPlayingService } from '../services/audio-playing.service';
import { AudioPlaying } from '../interfaces/audio-playing';
import { APP_CONFIG_STORAGE } from '../../app.config';
import { PlayingSong } from '../interfaces/playing-song';

@Component({
  selector: 'app-audio-players-controls',
  templateUrl: './audio-player-controls.component.html',
  styleUrls: ['./audio-player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerControlsComponent implements AfterViewInit, OnDestroy {
  private localAudioPlaying: AudioPlaying;
  private readonly destroy$ = new Subject();

  private currentPlayingSongId: number;
  progressBarValue = 0;

  audio = new Audio();

  @Output() emitNextSong = new EventEmitter<number>();
  @Output() emitPrevSong = new EventEmitter<number>();

  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('duration') duration: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('currentTime') currentTime: ElementRef;
  @ViewChild('audioVolume') audioVolume: ElementRef;
  @ViewChild('volumePercentage') volumePercentage: ElementRef;

  get currentTimeElement(): HTMLElement {
    return this.currentTime.nativeElement;
  }

  get progressBarElement(): any {
    return this.progressBar.nativeElement;
  }

  get audioPlaying(): AudioPlaying {
    return this.localAudioPlaying;
  }

  @Input() set audioPlaying(audioPlaying: AudioPlaying) {
    if (this.isCurrentSongPlaying(audioPlaying.song.id)) {
      this.playPause();
      this.changeDetectorRef.detectChanges();

      return;
    }

    this.currentPlayingSongId = audioPlaying.song.id;
    this.localAudioPlaying = audioPlaying;

    this.resetAudioPlayer();
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private audioPlayingService: AudioPlayingService,
    @Inject(APP_CONFIG_STORAGE) private config
  ) {}

  nextSong(): void {
    this.emitNextSong.emit(this.currentPlayingSongId + 1);
  }

  prevSong(): void {
    this.emitPrevSong.emit(this.currentPlayingSongId - 1);
  }

  onClickTitlePlay(): void {
    this.play();
  }

  onClickPlay(): void {
    this.play();
  }

  onClickVolume(): void {
    this.audio.muted = !this.audio.muted;
  }

  ngAfterViewInit(): void {
    const loadedAudio$ = this.loadedAudio();
    const progressBarEvent$ = this.clickOnProgressBar();
    const timeUpdateProgressBar$ = this.timeUpdateProgressBar();
    const audioVolumeEvent$ = this.onClickAudioVolume();

    merge(
      loadedAudio$,
      progressBarEvent$,
      timeUpdateProgressBar$,
      audioVolumeEvent$
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private playPause(): void {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }

  private loadedAudio(): Observable<Event> {
    return fromEvent(this.audio, 'loadeddata').pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.duration.nativeElement.textContent = this.convertDuration(
          this.audio.duration
        );
        this.currentTimeElement.textContent = this.convertDuration(
          this.audio.currentTime
        );

        if (this.audioPlaying.playPause.isPlaying) {
          return;
        }

        this.playPause();
      })
    );
  }

  private convertDuration(time: number): string {
    if (time === 0) {
      return '00:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const audioMinutesSeconds: Timestamp = {
      minutes,
      seconds,
    };

    return [
      audioMinutesSeconds.minutes.toString().padStart(2, '0'),
      audioMinutesSeconds.seconds.toString().padStart(2, '0'),
    ].join(':');
  }

  private clickOnProgressBar(): Observable<MouseEvent> {
    return fromEvent(this.progressBarElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        const percentProgressAudio =
          event.offsetX / this.progressBarElement.offsetWidth;

        this.audio.currentTime = percentProgressAudio * this.audio.duration;
        this.progressBarValue = Math.floor(percentProgressAudio * 100);
        this.currentTimeElement.textContent = this.convertDuration(
          this.audio.currentTime
        );

        this.setSavePlay();

        if (this.config.storage.length()) {
          this.updateTimeLineFromStorage();
        }

        this.progressBarElement.innerHTML = `${this.progressBarValue}% played`;
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  private timeUpdateProgressBar(): Observable<Event> {
    return fromEvent(this.audio, 'timeupdate').pipe(
      takeUntil(this.destroy$),
      tap(() => {
        if (this.audio.currentTime === this.audio.duration) {
          this.emitNextSong.emit(this.currentPlayingSongId + 1);
          this.audio.pause();

          return;
        }

        if (this.audio.paused) {
          return;
        }

        const currentAudioPlaybackTime = Math.floor(
          (100 / this.audio.duration) * this.audio.currentTime
        );

        if (isNaN(currentAudioPlaybackTime)) {
          return;
        }

        this.setSavePlay();

        this.progressBarValue = currentAudioPlaybackTime;
        this.currentTimeElement.textContent = this.convertDuration(
          this.audio.currentTime
        );
        this.progressBarElement.innerHTML = `${this.progressBarValue}% played`;

        this.changeDetectorRef.detectChanges();
      })
    );
  }

  private onClickAudioVolume(): Observable<MouseEvent> {
    return fromEvent(this.audioVolume.nativeElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        const offsetWidth = this.audioVolume.nativeElement.offsetWidth;
        const percentVolume = event.offsetX / offsetWidth;

        if (percentVolume < 0) {
          return;
        }

        this.audio.volume = percentVolume;
        this.volumePercentage.nativeElement.style.width = `${
          percentVolume * 100
        }%`;
      })
    );
  }

  private resetAudioPlayer(): void {
    this.audio.pause();
    this.progressBarValue = 0;

    this.audio.src = this.audioPlaying.song.previewUrl;
    this.audio.volume = 0.5;
  }

  private isCurrentSongPlaying(id: number): boolean {
    return (
      this.currentPlayingSongId !== undefined &&
      this.currentPlayingSongId === id
    );
  }

  private setSavePlay(): void {
    const currentlyPlayingSong: PlayingSong = {
      idList: this.audioPlaying.idList,
      song: this.audioPlaying.song,
      timeStamp: this.audio.currentTime,
    };

    this.config.storage.setItem(
      'audioPlaying',
      JSON.stringify(currentlyPlayingSong)
    );
  }

  private play(): void {
    if (this.config.storage.length()) {
      this.updateTimeLineFromStorage();
    }

    const isPlaying = false;
    const isPause = this.audio.paused;

    const audioPlaying: AudioPlaying = {
      ...this.audioPlaying,
      playPause: {
        isPause,
        isPlaying,
      },
    };

    this.audioPlayingService.currentAudioPlaying$.next(audioPlaying);
    this.changeDetectorRef.detectChanges();
  }

  private updateTimeLineFromStorage(): void {
    const currentPlayingSong: PlayingSong = JSON.parse(
      this.config.storage.getItem('audioPlaying')
    );

    this.audio.currentTime = currentPlayingSong.timeStamp;
  }
}
