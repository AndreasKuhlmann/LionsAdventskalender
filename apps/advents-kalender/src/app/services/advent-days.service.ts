import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

interface AdventDay {
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
  timer = 0;
  constructor(private storage: Storage) {
    this.storage.get('adventDays').then((days) => {
      if (days !== null) {
        this.adventDays = days;
      } else {
        this.adventDays = [
          {
            front: '1',
            unlockAt: 'December 1, 2017 00:00:00',
            flipped: false,
            content: 'A partridge in a pear tree',
          },
          {
            front: '2',
            unlockAt: 'December 2, 2017 00:00:00',
            flipped: false,
            content: 'Two turtle doves',
          },
          {
            front: '3',
            unlockAt: 'December 3, 2017 00:00:00',
            flipped: false,
            content: 'Three French hens',
          },
          {
            front: '4',
            unlockAt: 'December 4, 2017 00:00:00',
            flipped: false,
            content: 'Four calling birds',
          },
          {
            front: '5',
            unlockAt: 'December 5, 2017 00:00:00',
            flipped: false,
            content: 'Five golden rings!',
          },
          {
            front: '6',
            unlockAt: 'December 6, 2017 00:00:00',
            flipped: false,
            content: 'Six geese a laying',
          },
          {
            front: '7',
            unlockAt: 'December 7, 2017 00:00:00',
            flipped: false,
            content: 'Seven swans a swimming',
          },
          {
            front: '8',
            unlockAt: 'December 8, 2017 00:00:00',
            flipped: false,
            content: 'Eight maids a milking',
          },
          {
            front: '9',
            unlockAt: 'December 9, 2017 00:00:00',
            flipped: false,
            content: 'Nine ladies dancing',
          },
          {
            front: '10',
            unlockAt: 'December 10, 2017 00:00:00',
            flipped: false,
            content: 'Ten lords a leaping',
          },
          {
            front: '11',
            unlockAt: 'December 11, 2017 00:00:00',
            flipped: false,
            content: 'Eleven pipers piping',
          },
          {
            front: '12',
            unlockAt: 'December 12, 2017 00:00:00',
            flipped: false,
            content: '12 drummers drumming',
          },
          {
            front: '13',
            unlockAt: 'December 13, 2017 00:00:00',
            flipped: false,
            content: '12 drummers drumming',
          },
          {
            front: '14',
            unlockAt: 'December 14, 2017 00:00:00',
            flipped: false,
            content: 'A partridge in a pear tree',
          },
          {
            front: '15',
            unlockAt: 'December 15, 2017 00:00:00',
            flipped: false,
            content: 'Two turtle doves',
          },
          {
            front: '16',
            unlockAt: 'December 16, 2017 00:00:00',
            flipped: false,
            content: 'Three French hens',
          },
          {
            front: '17',
            unlockAt: 'December 17, 2017 00:00:00',
            flipped: false,
            content: 'Four calling birds',
          },
          {
            front: '18',
            unlockAt: 'December 18, 2017 00:00:00',
            flipped: false,
            content: 'Five golden rings!',
          },
          {
            front: '19',
            unlockAt: 'December 19, 2017 00:00:00',
            flipped: false,
            content: 'Six geese a laying',
          },
          {
            front: '20',
            unlockAt: 'December 20, 2017 00:00:00',
            flipped: false,
            content: 'Seven swans a swimming',
          },
          {
            front: '21',
            unlockAt: 'December 21, 2017 00:00:00',
            flipped: false,
            content: 'Eight maids a milking',
          },
          {
            front: '22',
            unlockAt: 'December 22, 2017 00:00:00',
            flipped: false,
            content: 'Nine ladies dancing',
          },
          {
            front: '23',
            unlockAt: 'December 23, 2017 00:00:00',
            flipped: false,
            content: 'Ten lords a leaping',
          },
          {
            front: '24',
            unlockAt: 'December 24, 2017 00:00:00',
            flipped: false,
            content: 'Eleven pipers piping',
          },
        ];
      }
    });
  }
}
