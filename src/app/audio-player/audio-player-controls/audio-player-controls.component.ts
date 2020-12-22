import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {Song} from '../shared/song';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Timestamp} from '../shared/timestamp';
import {AudioSettingsService} from '../audio-settings.service';

@Component({
  selector: 'app-audio-players-controls',
  templateUrl: './audio-player-controls.component.html',
  styleUrls: ['./audio-player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerControlsComponent implements AfterViewInit, OnDestroy {
  @Output() emitNextTrack = new EventEmitter<number>();
  @Output() emitPrevTrack = new EventEmitter<number>();

  currentSong: Song;
  progressBarValue = 0;

  destroy$ = new Subject();

  audio = new Audio();

  get song(): Song {
    return this.currentSong;
  }

  @Input() set song(song: Song) {
    if (this.isCurrentSongExist(song)) {
      this.playPause();

      return;
    }

    this.currentSong = song;

    this.resetAudioPlayer(song);
  }

  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('duration') duration: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('currentTime') currentTime: ElementRef;
  @ViewChild('audioVolume') audioVolume: ElementRef;
  @ViewChild('volumePercentage') volumePercentage: ElementRef;

  get currentTimeElement(): HTMLElement {
    return this.currentTime.nativeElement;
  }

  get progressAudio(): any {
    return this.progressBar.nativeElement;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private audioSettingsService: AudioSettingsService
  ) {}

  nextTrack(): void {
    this.emitNextTrack.emit(this.song.id);
  }

  prevTrack(): void {
    this.emitPrevTrack.emit(this.song.id);
  }

  onClickTitlePlay(): void {
    this.playPause();
    this.audioSettingsService.statePause$.next(!this.audio.paused);
  }

  onClickPlay(): void {
    this.playPause();
    this.audioSettingsService.statePause$.next(!this.audio.paused);
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
        this.duration.nativeElement.textContent = this.convertDuration(this.audio.duration);
        this.currentTimeElement.textContent = this.convertDuration(this.audio.currentTime);

        this.playPause();
      })
    );
  }

  private convertDuration(time: number): string {
    if (time === 0) {
      return '00:00';
    }

    const audioMinutesSeconds: Timestamp = this.convertToMinutesAndSeconds(time);

    return [
      audioMinutesSeconds.minutes.toString().padStart(2, '0'),
      audioMinutesSeconds.seconds.toString().padStart(2, '0'),
    ].join(':');
  }

  private convertToMinutesAndSeconds(timestamp): Timestamp {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);

    return {
      minutes,
      seconds,
    };
  }

  private clickOnProgressBar(): Observable<MouseEvent> {
    return fromEvent(this.progressAudio, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        const percent = event.offsetX / this.progressAudio.offsetWidth;

        this.audio.currentTime = percent * this.audio.duration;
        this.progressBarValue = Math.floor(percent * 100);
        this.currentTimeElement.textContent = this.convertDuration(this.audio.currentTime);

        this.progressAudio.innerHTML = `${this.progressBarValue}% played`;
        this.cdRef.detectChanges();
      })
    );
  }

  private timeUpdateProgressBar(): Observable<Event> {
    return fromEvent(this.audio, 'timeupdate').pipe(
      takeUntil(this.destroy$),
      tap(() => {
        if (this.audio.currentTime === this.audio.duration) {
          this.emitNextTrack.emit(this.song.id);
          this.audio.pause();

          return;
        }

        if (this.audio.paused) {
          return;
        }

        const currentTimeAudioPlayed = Math.floor(
          (100 / this.audio.duration) * this.audio.currentTime
        );

        if (isNaN(currentTimeAudioPlayed)) {
          return;
        }

        this.progressBarValue = currentTimeAudioPlayed;
        this.currentTimeElement.textContent = this.convertDuration(this.audio.currentTime);
        this.progressAudio.innerHTML = `${this.progressBarValue}% played`;

        this.cdRef.detectChanges();
      })
    );
  }

  private onClickAudioVolume(): Observable<MouseEvent> {
    return fromEvent(this.audioVolume.nativeElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        const volumeWidth = this.audioVolume.nativeElement.offsetWidth;
        const percentVolume = event.offsetX / volumeWidth;

        if (percentVolume < 0) {
          return;
        }

        this.audio.volume = percentVolume;
        this.volumePercentage.nativeElement.style.width = `${percentVolume * 100}%`;
      })
    );
  }

  private resetAudioPlayer(song: Song): void {
    this.audio.pause();
    this.audio.src = song.previewUrl;
    this.progressBarValue = 0;
    this.audio.volume = 0.5;
  }

  private isCurrentSongExist(song: Song): boolean {
    return this.currentSong !== undefined && this.currentSong.id === song.id;
  }
}
