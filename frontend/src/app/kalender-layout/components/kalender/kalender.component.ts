import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GewinnService, TagesGewinne } from '../../services/gewinn.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'kalender',
  templateUrl: './kalender.component.html',
  styleUrls: ['./kalender.component.scss'],
})
export class KalenderComponent implements OnInit {
  @ViewChild('container', { read: ElementRef }) container!: ElementRef;
  title = 'lions-kalender';
  containerXPosition = 0;
  containerYPosition = 0;
  containerWidth = 1208;
  containerHeight = '906px';
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
  private setPositon() {
    this.containerXPosition =
      this.container.nativeElement.getBoundingClientRect().x;
    this.containerYPosition =
      this.container.nativeElement.getBoundingClientRect().y;
    this.containerWidth =
      this.container.nativeElement.getBoundingClientRect().width;
    this.containerHeight =
      (
        this.container.nativeElement.getBoundingClientRect().width * 0.711
      ).toString() + 'px';
  }
  onResize(element: HTMLDivElement) {
    this.setPositon();
  }
}
