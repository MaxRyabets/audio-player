import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {Sound} from '../shared/sound';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Timestamp} from '../shared/timestamp';

@Component({
  selector: 'app-audio-players-controls',
  templateUrl: './audio-player-controls.component.html',
  styleUrls: ['./audio-player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerControlsComponent implements AfterViewInit, OnDestroy {
  @Output() emitNextTrack = new EventEmitter<number>();
  @Output() emitPrevTrack = new EventEmitter<number>();
  currentSound: Sound;
  progressBarValue = 0;

  destroy$ = new Subject();

  audio = new Audio();

  get sound(): Sound {
    return this.currentSound;
  }

  @Input() set sound(sound: Sound) {
    this.currentSound = sound;

    this.resetAudioPlayer(sound);
  }

  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('titleBtnPlay') titleBtnPlay: ElementRef;
  @ViewChild('play') play: ElementRef;
  @ViewChild('volume') volume: ElementRef;
  @ViewChild('duration') duration: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('currentTime') currentTime: ElementRef;
  @ViewChild('audioVolume') audioVolume: ElementRef;
  @ViewChild('volumePercentage') volumePercentage: ElementRef;

  get titlePlayElement(): HTMLElement {
    return this.titleBtnPlay.nativeElement;
  }

  get playElement(): HTMLElement {
    return this.play.nativeElement;
  }

  get progressAudio(): any {
    return this.progressBar.nativeElement;
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  nextTrack(): void {
    this.emitNextTrack.emit(this.sound.id);
  }

  prevTrack(): void {
    this.emitPrevTrack.emit(this.sound.id);
  }

  ngAfterViewInit(): void {
    const titlePlayEvent$ = this.onClickTitlePlay();
    const playEvent$ = this.onClickPlay();
    const volumeEvent$ = this.onClickVolume();
    const loadedAudio$ = this.loadedAudio();
    const progressBarEvent$ = this.clickOnProgressBar();
    const timeUpdateProgressBar$ = this.timeUpdateProgressBar();
    const audioVolumeEvent$ = this.onClickAudioVolume();

    merge(
      loadedAudio$,
      titlePlayEvent$,
      playEvent$,
      volumeEvent$,
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

  private onClickTitlePlay(): Observable<MouseEvent> {
    return fromEvent(this.titlePlayElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        this.playPause();
      })
    );
  }

  private onClickPlay(): Observable<MouseEvent> {
    return fromEvent(this.playElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => this.playPause())
    );
  }

  private onClickVolume(): Observable<MouseEvent> {
    return fromEvent(this.volume.nativeElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => this.audio.muted = !this.audio.muted)
    );
  }

  private loadedAudio(): Observable<Event> {
    return fromEvent(this.audio, 'loadeddata').pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.duration.nativeElement.textContent = this.convertDuration(this.audio.duration);
        this.currentTime.nativeElement.textContent = this.convertDuration(this.audio.currentTime);
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
        this.currentTime.nativeElement.textContent = this.convertDuration(this.audio.currentTime);

        this.progressAudio.innerHTML = `${this.progressBarValue}% played`;
        this.cdRef.detectChanges();
      })
    );
  }

  private timeUpdateProgressBar(): Observable<Event> {
    return fromEvent(this.audio, 'timeupdate').pipe(
      takeUntil(this.destroy$),
      tap(() => {
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
        this.currentTime.nativeElement.textContent = this.convertDuration(this.audio.currentTime);
        this.progressAudio.innerHTML = `${this.progressBarValue}% played`;

        this.cdRef.detectChanges();
      })
    );
  }

  private onClickAudioVolume(): Observable<MouseEvent> {
    return fromEvent(this.audioVolume.nativeElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        const audioVolumeWidth = this.audioVolume.nativeElement.offsetWidth;
        const newVolume = event.offsetX / audioVolumeWidth;

        if (newVolume < 0) {
          return;
        }

        this.audio.volume = newVolume;
        this.volumePercentage.nativeElement.style.width = `${newVolume * 100}%`;
      })
    );
  }

  private resetAudioPlayer(sound: Sound): void {
    this.audio.pause();
    this.audio.src = sound.previewUrl;
    this.progressBarValue = 0;
    this.audio.volume = 0.5;
  }
}
