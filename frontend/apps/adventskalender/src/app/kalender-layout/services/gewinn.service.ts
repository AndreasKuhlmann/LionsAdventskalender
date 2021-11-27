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
  public gewinne!: TagesGewinne[];
  timer!: NodeJS.Timeout;
  timerRunning = false;
  constructor(private storage: Storage, private http: HttpClient) {}

  async loadGewinne() {
    this.gewinne = await this.storage.get('gewinne');
    const refreshDate: Date = await this.storage.get('lastRefreshDate');
    // Die Gewinne sollen nur einmal am Tag geladen werden...
    if (!refreshDate || !this.gewinne || refreshDate.getDate() < new Date().getDate()) {
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
      // speichere die Gewinne und das letzte Ladedatum...
      await this.storage.set('gewinne', this.gewinne);
      await this.storage.set('lastRefreshDate', new Date());
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
