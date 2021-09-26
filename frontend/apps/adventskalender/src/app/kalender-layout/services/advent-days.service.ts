import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
export interface AdventDay {
  front: string;
  unlockAt: string;
  flipped: boolean;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdventDaysService {
  public adventDays: AdventDay[] = [];
  timer!: NodeJS.Timeout;
  timerRunning = false;
  constructor(private storage: Storage, private http: HttpClient) {}

  async loadDays() {
    const days = await this.storage.get('adventDays');
    if (days !== null && days.length > 0) {
      this.adventDays = days;
    } else {
      this.adventDays = await this.http
        .get<AdventDay[]>('https://kalenderapi.azurewebsites.net/api/Gifts')
        .toPromise();
    }
  }
  saveDays() {
    this.storage.set('adventDays', this.adventDays);
  }

  flipDay(day: AdventDay) {
    if (new Date(day.unlockAt) < new Date()) {
      if (!day.flipped && this.timerRunning) {
        day.flipped = !day.flipped;
        clearTimeout(this.timer);
      } else if (day.flipped) {
        day.flipped = false;
        this.timerRunning = true;
        this.timer = setTimeout(() => {
          day.flipped = true;
          this.timerRunning = false;
        }, 2000);
      } else {
        day.flipped = true;
        this.saveDays();
      }
    }
  }
}
