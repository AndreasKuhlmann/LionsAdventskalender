import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { toArray } from 'rxjs/internal/operators/toArray';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../environments/environment';
export interface Gewinn {
  Id: string;
  Beschreibung: string;
  Losnummer: number;
  Tag: number;
  flipped: boolean;
}

export interface TagesGewinne {
  Tag: number;
  Gewinne: Gewinn[];
}

@Injectable({
  providedIn: 'root',
})
export class GewinnService {
  timer!: NodeJS.Timeout;
  timerRunning = false;

  gewinne: TagesGewinne[] = [];
  refreshDate = new Date();

  constructor(private storage: Storage, private http: HttpClient) {}

  async loadGewinne() {
    // Die Gewinne sollen nur einmal am Tag geladen werden...
    console.log(this.refreshDate);
    console.log(this.gewinne);
    if (
      this.refreshDate.getDate() < new Date().getDate() ||
      this.gewinne.length == 0
    ) {
      console.log('Refresh');
      this.refreshDate = new Date();
      this.gewinne = await this.http
        .get<Gewinn[]>(environment.url)
        .pipe(
          mergeMap((d) => d),
          groupBy((d) => d.Tag),
          mergeMap((groups) => groups.pipe(toArray())),
          map((group) => {
            return {
              Tag: group[0].Tag,
              Gewinne: group,
            };
          }),
          toArray()
        )
        .toPromise();
    }
  }

  async flipDay(gewinn: Gewinn) {
    if (gewinn.Losnummer > 0) {
      if (!gewinn.flipped && this.timerRunning) {
        gewinn.flipped = !gewinn.flipped;
        clearTimeout(this.timer);
      } else if (gewinn.flipped) {
        gewinn.flipped = false;
        this.timerRunning = true;
        this.timer = setTimeout(() => {
          gewinn.flipped = true;
          this.timerRunning = false;
        }, 2000);
      } else {
        gewinn.flipped = true;
        await this.storage.set('gewinne', this.gewinne);
      }
    }
  }
}
