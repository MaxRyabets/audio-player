import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class AudioPlayerControlsComponent implements OnInit, AfterViewInit, OnDestroy {
  currentSound: Sound;

  get sound(): Sound {
    return this.currentSound;
  }

  @Input() set sound(sound: Sound) {
    this.currentSound = sound;

    this.audio.pause();
    this.audio.src = sound.previewUrl;
  }

  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('titleBtnPlay') titleBtnPlay: ElementRef;
  @ViewChild('play') play: ElementRef;
  @ViewChild('volume') volume: ElementRef;
  @ViewChild('duration') duration: ElementRef;

  destroy$ = new Subject();

  audio = new Audio();

  get titlePlayElement(): HTMLElement {
    return this.titleBtnPlay.nativeElement;
  }

  get playElement(): HTMLElement {
    return this.play.nativeElement;
  }

  ngOnInit(): void {
    this.audio.volume = .75;
  }

  ngAfterViewInit(): void {
    const titlePlayEvent$ = this.onClickTitlePlay();
    const playEvent$ = this.onClickPlay();
    const volumeEvent$ = this.onClickVolume();
    const loadedAudio$ = this.loadedAudio();

    merge(
      loadedAudio$,
      titlePlayEvent$,
      playEvent$,
      volumeEvent$,
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

  private loadedAudio(): Observable<any> {
    return fromEvent(this.audio, 'loadeddata').pipe(
      takeUntil(this.destroy$),
      tap((event) => {
        this.duration.nativeElement.textContent = this.convertDuration(this.audio.duration);
      })
    );
  }

  private convertDuration(duration: number): string {
    const audioMinutesSeconds: Timestamp = this.convertToMinutesAndSeconds(duration);

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
}
