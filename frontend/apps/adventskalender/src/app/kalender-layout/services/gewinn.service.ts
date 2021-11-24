import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { toArray } from 'rxjs/internal/operators/toArray';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../environments/environment';
export interface Gewinn {
  Id: string,
  Beschreibung: string;
  Losnummer: number,
  Tag: number
  flipped: boolean;
}

export interface TagesGewinne {
  Tag: number,
  Gewinne: Gewinn[]
}

@Injectable({
  providedIn: 'root',
})
export class GewinnService {
  public gewinne!: TagesGewinne[];
  timer!: NodeJS.Timeout;
  timerRunning = false;
  constructor(private storage: Storage, private http: HttpClient) {}

  async loadGewinne() {
    const tagesGewinne = await this.storage.get('Gewinne');
    if (tagesGewinne !== null && tagesGewinne.length > 0) {
      this.gewinne = tagesGewinne;
    } else {
      this.gewinne = await this.http
        .get<Gewinn[]>(environment.url).pipe(
          mergeMap(d=>d),
          groupBy(d=>d.Tag),
          mergeMap(groups=>groups.pipe(toArray())),
          map(group=> {
            return {
              Tag: group[0].Tag,
              Gewinne: group
            }
          }),
          toArray()
        ).toPromise();
    }
  }
  saveGewinne() {
    this.storage.set('Gewinne', this.gewinne);
  }

  flipDay(day: Gewinn) {
    const today = new Date();
    if (today > new Date(today.getFullYear(), 10, 1, 0)) {
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
        this.saveGewinne();
      }
    }
  }
}
