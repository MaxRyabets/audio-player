import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Sound} from '../shared/sound';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-audio-players-controls',
  templateUrl: './audio-player-controls.component.html',
  styleUrls: ['./audio-player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerControlsComponent implements AfterViewInit, OnDestroy {
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

  destroy$ = new Subject();

  audio = new Audio();

  get titlePlayElement(): HTMLElement {
    return this.titleBtnPlay.nativeElement;
  }

  get playElement(): HTMLElement {
    return this.play.nativeElement;
  }

  ngAfterViewInit(): void {
    const titlePlayEvent$ = this.onClickTitlePlay();
    const playElementEvent$ = this.onClickPlayElement();

    merge(
      titlePlayEvent$,
      playElementEvent$
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

  private onClickPlayElement(): Observable<MouseEvent> {
    return fromEvent(this.playElement, 'click').pipe(
      takeUntil(this.destroy$),
      tap((event: MouseEvent) => {
        this.playPause();
      })
    );
  }
}
