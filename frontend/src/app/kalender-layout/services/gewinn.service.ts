import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Storage } from '@ionic/storage';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { toArray } from 'rxjs/internal/operators/toArray';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
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
  private timer?: ReturnType<typeof setTimeout>;
  private timerRunning = false;
  private refreshDate = new Date();

  private readonly _tagesGewinne = signal<TagesGewinne[]>([]);
  readonly tagesGewinne = this._tagesGewinne.asReadonly();

  constructor(private storage: Storage, private http: HttpClient) { }

  async loadGewinne() {
    // Die Gewinne sollen nur einmal am Tag geladen werden...
    // (komplettes Datum vergleichen - nur der Tag im Monat würde z.B. am 30.11. -> 1.12. versagen)
    if (this.refreshDate.toDateString() !== new Date().toDateString() || this._tagesGewinne().length == 0) {
      console.log('Refresh');
      // reload all Gewinne...
      let tagesGewinne = await firstValueFrom(this.http
        .get<Gewinn[]>(environment.url)
        .pipe(
          mergeMap((d) => d),
          groupBy((d) => d.Tag),
          mergeMap((groups) => groups.pipe(toArray())),
          map((group): TagesGewinne => {
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
        tagesGewinne = tagesGewinne.map(g => {
          const tg = tagesGewinneFromStorage.find(tg => tg.Tag == g.Tag);
          return { ...g, flipped: tg ? tg.flipped && g.Gewinne[0].Losnummer != 0 : false };
        });
      }
      this._tagesGewinne.set(tagesGewinne);
      // update...
      await this.saveToStorage();
      this.refreshDate = new Date();
    }
  }

  async flipDay(tagesGewinn: TagesGewinne) {
    // immer den aktuellen Stand aus dem Signal verwenden
    const current = this._tagesGewinne().find(tg => tg.Tag == tagesGewinn.Tag);
    if (current && current.Gewinne?.length > 0 && current.Gewinne[0].Losnummer > 0) {
      if (!current.flipped && this.timerRunning) {
        this.setFlipped(current.Tag, true);
        clearTimeout(this.timer);
      } else if (current.flipped) {
        this.setFlipped(current.Tag, false);
        this.timerRunning = true;
        this.timer = setTimeout(() => {
          this.setFlipped(current.Tag, true);
          this.timerRunning = false;
        }, 2000);
      } else {
        this.setFlipped(current.Tag, true);
        await this.saveToStorage();
      }
    }
  }

  private setFlipped(tag: number, flipped: boolean) {
    this._tagesGewinne.update(list =>
      list.map(tg => (tg.Tag == tag ? { ...tg, flipped } : tg))
    );
  }

  private saveToStorage() {
    return this.storage.set('tagesGewinne', this._tagesGewinne());
  }
}
