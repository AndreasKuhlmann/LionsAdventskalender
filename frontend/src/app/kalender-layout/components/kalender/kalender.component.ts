import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { GewinnService, TagesGewinne } from '../../services/gewinn.service';
import { App } from '@capacitor/app';
import { DoorComponent } from '../door/door.component';

@Component({
    selector: 'kalender',
    templateUrl: './kalender.component.html',
    styleUrls: ['./kalender.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DoorComponent]
})
export class KalenderComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly container = viewChild.required('container', { read: ElementRef });
  title = 'lions-kalender';
  readonly containerXPosition = signal(0);
  readonly containerYPosition = signal(0);
  readonly containerWidth = signal(1208);
  readonly containerHeight = signal('906px');
  private resizeObserver?: ResizeObserver;
  constructor(public service: GewinnService, private _ngZone: NgZone) {
    // Wenn der Kalender in den Vordergrund kommt aktualisiere die Daten...
    document.addEventListener('visibilitychange', async (e: any) => {
      // console.log(e.target.hidden);
      // console.log(e.target.visibilityState);
      this._ngZone.run(async () => {
        if (!e.target.hidden) {
          await this.service.loadGewinne();
        }
      });
    });
    // // nur für iOS and aktivieren...
    // App.addListener('appStateChange', (state) => {
    //   this._ngZone.run(async () => {
    //     if (state.isActive) {
    //       console.log('App has come to the foreground!');
    //       await this.service.loadGewinne();
    //     }
    //   });
    // });
  }
  async flip(gewinne: TagesGewinne) {
    this.service.flipDay(gewinne);
  }

  async ngOnInit() {
    await this.service.loadGewinne();
    setTimeout(() => this.setPositon());
  }

  ngAfterViewInit() {
    // Reagiert auch auf Größenänderungen ohne window:resize-Event,
    // z.B. wenn beim Wechsel Mobil -> Desktop die Scrollbar verschwindet.
    this.resizeObserver = new ResizeObserver(() =>
      this._ngZone.run(() => this.setPositon())
    );
    this.resizeObserver.observe(this.container().nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
  private setPositon() {
    const rect = this.container().nativeElement.getBoundingClientRect();
    this.containerXPosition.set(rect.x);
    this.containerYPosition.set(rect.y);
    this.containerWidth.set(rect.width);
    this.containerHeight.set(`${rect.width * 0.711}px`);
  }
  onResize(element: HTMLDivElement) {
    this.setPositon();
  }
}
