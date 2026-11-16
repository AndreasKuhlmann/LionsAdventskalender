import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyNumberDialogComponent } from '../components/my-number-dialog/my-number-dialog.component';
import {
  WinnerDialogComponent,
  WinnerDialogData,
} from '../components/winner-dialog/winner-dialog.component';
import { ConfettiService } from './confetti.service';
import { DoorSoundService } from './door-sound.service';
import { Gewinn, GewinnService } from './gewinn.service';
import { MyNumberService, formatKalendernummer } from './my-number.service';
import { ChristmasEveService, isAfterChristmas } from './christmas-eve.service';
import {
  AFTER_CHRISTMAS_MESSAGE,
  CHRISTMAS_EVE_DOOR,
} from '../components/christmas-eve/christmas-eve.texts';

const HINT_SHOWN_KEY = 'adventskalender.nummernTippGezeigt';

/** Die Feier beginnt, wenn die Tür aufgeknarrt ist (ms). */
const CELEBRATION_DELAY_MS = 1000;

/**
 * "Habe ich gewonnen?" - prüft beim Öffnen eines Türchens, ob eine der eigenen
 * Kalendernummern dabei ist, und feiert dann mit Konfetti, Fanfare und Glückwunsch-Dialog.
 */
@Injectable({ providedIn: 'root' })
export class WinnerService {
  private readonly myNumber = inject(MyNumberService);
  private readonly gewinnService = inject(GewinnService);
  private readonly sound = inject(DoorSoundService);
  private readonly confetti = inject(ConfettiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly christmasEve = inject(ChristmasEveService);

  private afterChristmasGreetingShown = false;

  /**
   * Ein Türchen wurde vom Nutzer geöffnet.
   * Bei einem Gewinn wird jedes Mal gefeiert - auch wenn die Tür kurz zugeklappt wurde und
   * automatisch wieder aufgeht.
   * @param firstOpen false, wenn dieselbe Tür in dieser Sitzung schon einmal offen war -
   *                  dann ohne Gewinn keine erneuten Hinweise.
   */
  doorOpened(tag: number, gewinne: readonly Gewinn[], firstOpen: boolean): void {
    const numbers = this.myNumber.numbers();
    const wins = this.myNumber.winsIn(gewinne);
    const isChristmasEve = tag === CHRISTMAS_EVE_DOOR;

    if (wins.length > 0) {
      // Gewinn: statt der Weihnachtsmelodie gibt es die Fanfare.
      // An Heiligabend folgt nach dem Glückwunsch-Dialog die Weihnachtsszene.
      this.sound.playOpen({ melody: false });
      const afterCelebration = isChristmasEve ? () => this.christmasEve.start() : undefined;
      setTimeout(() => this.celebrate([{ tag, gewinne: wins }], afterCelebration), CELEBRATION_DELAY_MS);
      return;
    }

    if (isChristmasEve) {
      // Heiligabend: Glocken und "Stille Nacht" statt Knarren und kurzer Melodie
      this.christmasEve.start();
      return;
    }

    this.sound.playOpen();

    if (!firstOpen) {
      return;
    }
    if (numbers.length === 0) {
      this.showNumberHintOnce();
    } else if (gewinne.some((g) => g.Losnummer > 0)) {
      const text =
        numbers.length === 1
          ? `Ihre Nummer ${formatKalendernummer(numbers[0])} ist heute nicht dabei`
          : `Keine Ihrer ${numbers.length} Nummern ist heute dabei`;
      this.snackBar.open(`${text} – viel Glück beim nächsten Türchen!`, undefined, { duration: 4000 });
    }
  }

  /** Dialog zum Verwalten der Kalendernummern. Danach werden neue Nummern geprüft. */
  editNumbers(): void {
    const before = new Set(this.myNumber.numbers());
    this.dialog
      .open(MyNumberDialogComponent, { width: '28rem', maxWidth: '95vw' })
      .afterClosed()
      .subscribe(() => {
        const added = this.myNumber.numbers().filter((n) => !before.has(n));
        if (added.length > 0) {
          this.checkOpenedDoors(added);
        }
      });
  }

  /**
   * Neu hinzugefügte Nummern gegen die bereits geöffneten Türchen prüfen.
   * Noch geschlossene Türchen werden bewusst NICHT geprüft - das würde die Überraschung verraten.
   */
  private checkOpenedDoors(numbers: number[]): void {
    const wins = this.gewinnService
      .tagesGewinne()
      .filter((tag) => tag.flipped)
      .map((tag) => ({ tag: tag.Tag, gewinne: this.myNumber.winsIn(tag.Gewinne, numbers) }))
      .filter((win) => win.gewinne.length > 0)
      .sort((a, b) => a.tag - b.tag);

    if (wins.length > 0) {
      this.celebrate(wins);
      return;
    }
    const text =
      numbers.length === 1
        ? `die ${formatKalendernummer(numbers[0])}`
        : `eine Ihrer ${this.myNumber.count()} Nummern`;
    this.snackBar.open(
      `Gespeichert! Ab jetzt prüfen wir bei jedem Türchen, ob ${text} gewonnen hat.`,
      undefined,
      { duration: 5000 }
    );
  }

  /** Konfetti, Fanfare und Glückwunsch-Dialog. `afterClosed` läuft nach dem Schließen des Dialogs. */
  private celebrate(wins: WinnerDialogData['wins'], afterClosed?: () => void): void {
    this.confetti.burst();
    this.sound.playFanfare();
    const dialogRef = this.dialog.open<WinnerDialogComponent, WinnerDialogData>(WinnerDialogComponent, {
      width: '26rem',
      maxWidth: '95vw',
      data: { wins },
    });
    if (afterClosed) {
      dialogRef.afterClosed().subscribe(() => afterClosed());
    }
  }

  /**
   * Einmaliger Tipp für Nutzer ohne hinterlegte Kalendernummer.
   * Nach Weihnachten stattdessen (einmal pro Sitzung) ein Weihnachtsgruß.
   */
  private showNumberHintOnce(): void {
    if (isAfterChristmas()) {
      if (!this.afterChristmasGreetingShown) {
        this.afterChristmasGreetingShown = true;
        this.snackBar.open(AFTER_CHRISTMAS_MESSAGE, undefined, { duration: 6000 });
      }
      return;
    }
    if (readFlag(HINT_SHOWN_KEY)) {
      return;
    }
    writeFlag(HINT_SHOWN_KEY);
    this.snackBar
      .open(
        'Tipp: Hinterlegen Sie Ihre Kalendernummern – dann sehen Sie sofort, ob Sie gewonnen haben.',
        'Eingeben',
        { duration: 10000 }
      )
      .onAction()
      .subscribe(() => this.editNumbers());
  }
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function writeFlag(key: string): void {
  try {
    localStorage.setItem(key, 'true');
  } catch {
    // ignorieren
  }
}
