import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Gewinn, GewinnService } from '../../services/gewinn.service';

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
  containerHeight = "859px";
  constructor(public days: GewinnService) {}
  flip(day: Gewinn) {
    this.days.flipDay(day);
  }

  async ngOnInit() {
    await this.days.loadGewinne();
    setTimeout(()=>this.setPositon());
  }
  private setPositon() {
    this.containerXPosition =
      this.container.nativeElement.getBoundingClientRect().x;
    this.containerYPosition =
      this.container.nativeElement.getBoundingClientRect().y;
    this.containerWidth =
      this.container.nativeElement.getBoundingClientRect().width;
    this.containerHeight =
      (this.container.nativeElement.getBoundingClientRect().width * 0.711).toString() + 'px';
  }
  onResize(element: HTMLDivElement) {
    this.setPositon();
  }
}
