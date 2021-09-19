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
  constructor(private storage: Storage) {}

  async loadDays() {
    // const days: AdventDay[] = [];
    const days = await this.storage.get('adventDays');
    if (days !== null && days.length > 0) {
      this.adventDays = days;
    } else {
      this.adventDays = [
        {
          front: '1',
          unlockAt: 'Septemer 1, 2021 00:00:00',
          flipped: false,
          content: 'A partridge in a pear tree',
        },
        {
          front: '2',
          unlockAt: 'Septemer 2, 2021 00:00:00',
          flipped: false,
          content: 'Two turtle doves',
        },
        {
          front: '3',
          unlockAt: 'Septemer 3, 2021 00:00:00',
          flipped: false,
          content: 'Three French hens',
        },
        {
          front: '4',
          unlockAt: 'Septemer 4, 2021 00:00:00',
          flipped: false,
          content: 'Four calling birds',
        },
        {
          front: '5',
          unlockAt: 'Septemer 5, 2021 00:00:00',
          flipped: false,
          content: 'Five golden rings!',
        },
        {
          front: '6',
          unlockAt: 'Septemer 6, 2021 00:00:00',
          flipped: false,
          content: 'Six geese a laying',
        },
        {
          front: '7',
          unlockAt: 'Septemer 7, 2021 00:00:00',
          flipped: false,
          content: 'Seven swans a swimming',
        },
        {
          front: '8',
          unlockAt: 'Septemer 8, 2021 00:00:00',
          flipped: false,
          content: 'Eight maids a milking',
        },
        {
          front: '9',
          unlockAt: 'Septemer 9, 2021 00:00:00',
          flipped: false,
          content: 'Nine ladies dancing',
        },
        {
          front: '10',
          unlockAt: 'Septemer 10, 2021 00:00:00',
          flipped: false,
          content: 'Ten lords a leaping',
        },
        {
          front: '11',
          unlockAt: 'Septemer 11, 2021 00:00:00',
          flipped: false,
          content: 'Eleven pipers piping',
        },
        {
          front: '12',
          unlockAt: 'Septemer 12, 2021 00:00:00',
          flipped: false,
          content: '12 drummers drumming',
        },
        {
          front: '13',
          unlockAt: 'Septemer 13, 2021 00:00:00',
          flipped: false,
          content: '12 drummers drumming',
        },
        {
          front: '14',
          unlockAt: 'Septemer 14, 2021 00:00:00',
          flipped: false,
          content: 'A partridge in a pear tree',
        },
        {
          front: '15',
          unlockAt: 'Septemer 15, 2021 00:00:00',
          flipped: false,
          content: 'Two turtle doves',
        },
        {
          front: '16',
          unlockAt: 'Septemer 16, 2021 00:00:00',
          flipped: false,
          content: 'Three French hens',
        },
        {
          front: '17',
          unlockAt: 'Septemer 17, 2021 00:00:00',
          flipped: false,
          content: 'Four calling birds',
        },
        {
          front: '18',
          unlockAt: 'Septemer 18, 2021 00:00:00',
          flipped: false,
          content: 'Five golden rings!',
        },
        {
          front: '19',
          unlockAt: 'Septemer 19, 2021 00:00:00',
          flipped: false,
          content: 'Six geese a laying',
        },
        {
          front: '20',
          unlockAt: 'Septemer 20, 2021 00:00:00',
          flipped: false,
          content: 'Seven swans a swimming',
        },
        {
          front: '21',
          unlockAt: 'Septemer 21, 2021 00:00:00',
          flipped: false,
          content: 'Eight maids a milking',
        },
        {
          front: '22',
          unlockAt: 'Septemer 22, 2021 00:00:00',
          flipped: false,
          content: 'Nine ladies dancing',
        },
        {
          front: '23',
          unlockAt: 'Septemer 23, 2021 00:00:00',
          flipped: false,
          content: 'Ten lords a leaping',
        },
        {
          front: '24',
          unlockAt: 'Septemer 24, 2021 00:00:00',
          flipped: false,
          content: 'Eleven pipers piping',
        },
      ];
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
