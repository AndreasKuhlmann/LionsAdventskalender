import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AdventDay, AdventDaysService } from '../../services/advent-days.service';

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
  containerWidth = 1095;
  containerHeight = 768;
  constructor(public days: AdventDaysService) {}
  flip(day: AdventDay) {
    this.days.flipDay(day);
  }

  async ngOnInit() {
    await this.days.loadDays();
    setTimeout(()=>this.setPositon());
  }
  private setPositon() {
    this.containerXPosition =
      this.container.nativeElement.getBoundingClientRect().x;
    this.containerYPosition =
      this.container.nativeElement.getBoundingClientRect().y;
    this.containerWidth =
      this.container.nativeElement.getBoundingClientRect().width;
  }
  onResize(element: HTMLDivElement) {
    this.setPositon();
  }
}
