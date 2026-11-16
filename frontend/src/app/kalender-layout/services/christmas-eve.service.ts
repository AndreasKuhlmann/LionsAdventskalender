import { Injectable, inject, signal } from '@angular/core';
import { DoorSoundService } from './door-sound.service';

/** Dauer der Szene, wenn keine Musik läuft (stumm/kein Audio) - in Sekunden */
const SILENT_SCENE_SECONDS = 30;
/** Die Szene endet kurz nach dem letzten Ton */
const AFTER_MUSIC_SECONDS = 3;

/**
 * Heiligabend-Special: Beim Öffnen von Tür 24 läuten Glocken, "Stille Nacht" erklingt,
 * der Bildschirm wird zum Nachthimmel mit Stern, es schneit dichter, die Lichter im Bild
 * leuchten stärker und der Weihnachtsgruß erscheint.
 */
@Injectable({ providedIn: 'root' })
export class ChristmasEveService {
  private readonly sound = inject(DoorSoundService);

  /** Läuft die Weihnachtsszene gerade? */
  readonly active = signal(false);

  private endTimer?: ReturnType<typeof setTimeout>;

  start(): void {
    if (this.active()) {
      return;
    }
    this.active.set(true);
    const musicSeconds = this.sound.playChristmasEve();
    const sceneSeconds = musicSeconds > 0 ? musicSeconds + AFTER_MUSIC_SECONDS : SILENT_SCENE_SECONDS;
    clearTimeout(this.endTimer);
    this.endTimer = setTimeout(() => this.end(), sceneSeconds * 1000);
  }

  /** Szene beenden (automatisch nach dem Lied oder über "Schließen"). */
  end(): void {
    clearTimeout(this.endTimer);
    if (this.active()) {
      this.active.set(false);
      this.sound.stopMusic();
    }
  }
}

/** Ist die Weihnachtszeit vorbei? (25. Dezember bis Ende Januar) */
export function isAfterChristmas(date: Date = new Date()): boolean {
  return (date.getMonth() === 11 && date.getDate() >= 25) || date.getMonth() === 0;
}
