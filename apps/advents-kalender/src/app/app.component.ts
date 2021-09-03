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
  @ViewChild('grid', { read: ElementRef }) grid: ElementRef | undefined;
  title = 'advents-kalender';
  gridXPosition = 0;
  gridYPosition = 0;
  gridWidth = 1095;
  gridHeight = 768;
  constructor(public days: AdventDaysService) {}
  flip(day: AdventDay) {
    this.days.flipDay(day);
  }
  async ngOnInit() {
    await this.days.loadDays();
    if (this.grid) {
      this.gridXPosition = this.grid.nativeElement.getBoundingClientRect().x;
      this.gridYPosition = this.grid.nativeElement.getBoundingClientRect().y;
      this.gridWidth = this.grid.nativeElement.getBoundingClientRect().width;
      this.gridHeight = this.grid.nativeElement.getBoundingClientRect().height;
      console.log(`${this.gridXPosition} ${this.gridYPosition} ${this.gridWidth} ${this.gridHeight}`);
    }
  }
}
