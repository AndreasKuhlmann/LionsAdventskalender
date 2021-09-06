import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AdventDay, AdventDaysService } from './services/advent-days.service';

@Component({
  selector: 'lions-adventskalender-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('container', { read: ElementRef }) container!: ElementRef;
  title = 'advents-kalender';
  containerXPosition = 0;
  containerYPosition = 0;
  containerWidth = 1095;
  containerHeight = 768;
  constructor(public days: AdventDaysService) {}
  flip(day: AdventDay) {
    this.days.flipDay(day);
  }
  async ngOnInit() {
    await this.days.loadDays();
    setTimeout(() => {
      this.containerXPosition =
        this.container.nativeElement.getBoundingClientRect().x;
      this.containerYPosition =
        this.container.nativeElement.getBoundingClientRect().y;
      this.containerWidth =
        this.container.nativeElement.getBoundingClientRect().width;
    },100);
  }
}
