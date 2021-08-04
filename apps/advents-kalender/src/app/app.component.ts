import { Component, OnInit } from '@angular/core';
import { AdventDay, AdventDaysService } from './services/advent-days.service';

@Component({
  selector: 'lions-adventskalender-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'advents-kalender';
  constructor(public days: AdventDaysService) {}
  flip(day: AdventDay) {
    this.days.flipDay(day);
  }
  async ngOnInit() {
    await this.days.loadDays();
  }
}
