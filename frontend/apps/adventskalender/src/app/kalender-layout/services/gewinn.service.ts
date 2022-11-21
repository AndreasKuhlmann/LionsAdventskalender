import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { toArray } from 'rxjs/internal/operators/toArray';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../environments/environment';
import { firstValueFrom, tap } from 'rxjs';
export interface Gewinn {
  Id: string;
  Beschreibung: string;
  Losnummer: number;
  Tag: number;
}

export interface TagesGewinne {
  Tag: number;
  Gewinne: Gewinn[];
  flipped: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GewinnService {
  timer!: NodeJS.Timeout;
  timerRunning = false;
  tagesGewinne: TagesGewinne[] = [];
  refreshDate = new Date();

  constructor(private storage: Storage, private http: HttpClient) { }

  async loadGewinne() {

    // Die Gewinne sollen nur einmal am Tag geladen werden...
    // console.log(this.refreshDate);
    // console.log(this.gewinne);
    if (this.refreshDate.getDate() < new Date().getDate() || this.tagesGewinne?.length == 0) {
      console.log('Refresh');
      // reload all Gewinne...
      this.tagesGewinne = await firstValueFrom(this.http
        .get<Gewinn[]>(environment.url)
        .pipe(
          mergeMap((d) => d),
          groupBy((d) => d.Tag),
          mergeMap((groups) => groups.pipe(toArray())),
          map((group) => {
            return {
              Tag: group[0].Tag,
              Gewinne: group,
              flipped: false
            };
          }),
          toArray()
        ));
      const tagesGewinneFromStorage: TagesGewinne[] = await this.storage.get('tagesGewinne');
      if (tagesGewinneFromStorage) {
        // set flipped=true, when the door was already opened before...
        this.tagesGewinne.forEach(g => {
          const tg = tagesGewinneFromStorage.find(tg => tg.Tag == g.Tag);
          g.flipped = tg ? tg.flipped && g.Gewinne[0].Losnummer != 0 : false;
        });
      }
      // update...
      await this.storage.set('tagesGewinne', this.tagesGewinne);
      this.refreshDate = new Date();
    }
  }

  async flipDay(tagesGewinn: TagesGewinne) {
    if (tagesGewinn.Gewinne && tagesGewinn.Gewinne.length > 0 && tagesGewinn.Gewinne[0].Losnummer > 0) {
      if (!tagesGewinn.flipped && this.timerRunning) {
        tagesGewinn.flipped = !tagesGewinn.flipped;
        clearTimeout(this.timer);
      } else if (tagesGewinn.flipped) {
        tagesGewinn.flipped = false;
        this.timerRunning = true;
        this.timer = setTimeout(() => {
          tagesGewinn.flipped = true;
          this.timerRunning = false;
        }, 2000);
      } else {
        tagesGewinn.flipped = true;
        await this.storage.set('tagesGewinne', this.tagesGewinne);
      }
    }
  }
}
