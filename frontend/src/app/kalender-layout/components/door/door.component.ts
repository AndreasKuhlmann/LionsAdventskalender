import { Gewinn } from '../../services/gewinn.service';
import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { DoorSoundService } from '../../services/door-sound.service';
import { MyNumberService } from '../../services/my-number.service';
import { WinnerService } from '../../services/winner.service';
import { TwinkleLightsComponent } from '../twinkle-lights/twinkle-lights.component';

/** Anzahl der Funken, die beim Öffnen aus der Tür aufsteigen. */
const SPARK_COUNT = 14;
/** Dauer des Aufleuchtens beim Öffnen (ms) - danach bleibt ein ruhiger Lichtschein. */
const LIGHT_BURST_MS = 2000;

interface Spark {
  id: number;
  /** horizontale Startposition in % der Türbreite */
  x: number;
  delay: number;
  duration: number;
  /** seitliche Abweichung beim Aufsteigen in px */
  drift: number;
  size: number;
}

@Component({
  selector: 'door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss', './door-light.scss'],
  imports: [TwinkleLightsComponent],
})
export class DoorComponent {
  readonly baseX = input(0);
  readonly baseY = input(0);
  readonly backgroundWidth = input(0);
  readonly no = input(0);
  readonly isOpen = input(false);
  readonly tagesGewinne = input<Gewinn[]>([]);

  private readonly door = viewChild.required('door', { read: ElementRef });
  private readonly doorFace = viewChild.required('doorFace', { read: ElementRef });

  readonly keepClose = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  private readonly sound = inject(DoorSoundService);
  private readonly winner = inject(WinnerService);
  private readonly myNumber = inject(MyNumberService);

  /** Die Tür kann erst geöffnet werden, wenn für den Tag Gewinne gezogen wurden. */
  private readonly isLocked = computed(() => !(this.tagesGewinne()[0]?.Losnummer > 0));

  /** Wurde die Tür in dieser Sitzung schon einmal vom Nutzer geöffnet? (keine doppelte Feier) */
  private openedBefore = false;

  /** Kurzes helles Aufleuchten beim Öffnen */
  readonly lightBurst = signal(false);
  /** Gerade aufsteigende Funken */
  readonly sparks = signal<Spark[]>([]);
  private sparkId = 0;
  private lightTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Ton (und ggf. Gewinn-Feier) beim Öffnen/Schließen - aber nicht beim ersten Anzeigen
    // (bereits geöffnete Türen werden beim Laden aus dem Speicher wiederhergestellt).
    let wasOpen: boolean | undefined;
    effect(() => {
      const open = this.isOpen();
      if (wasOpen !== undefined && open !== wasOpen) {
        untracked(() => {
          if (open) {
            this.lightUp();
            this.winner.doorOpened(this.no(), this.tagesGewinne(), !this.openedBefore);
            this.openedBefore = true;
          } else {
            this.sound.playClose();
          }
        });
      }
      wasOpen = open;
    });

    // Der Tür-Hintergrund zeigt genau den Ausschnitt des Kalenderbildes, der hinter der Tür liegt.
    // Läuft nach dem Rendern (Layout ist dann aktuell) und erneut, sobald sich
    // baseX, baseY oder backgroundWidth ändern.
    afterRenderEffect({
      earlyRead: () => {
        const rect = this.door().nativeElement.getBoundingClientRect();
        const x = Math.floor(this.baseX() - rect.x);
        const y = Math.floor(this.baseY() - rect.y);
        return {
          position: `${x}px ${y}px`,
          size: `${this.backgroundWidth()}px`,
        };
      },
      write: (background) => {
        const style = this.doorFace().nativeElement.style;
        style.backgroundPosition = background().position;
        style.backgroundSize = background().size;
        // gleicher Ausschnitt für die funkelnden Lichter auf der Tür
        style.setProperty('--twinkle-position', background().position);
        style.setProperty('--twinkle-size', `${background().size} auto`);
      },
    });
  }

  /** Beim Öffnen: warmes Licht flammt auf, Funken steigen aus der Tür. */
  private lightUp(): void {
    this.sparks.set(
      Array.from({ length: SPARK_COUNT }, () => ({
        id: ++this.sparkId, // neue IDs -> Animation startet auch bei erneutem Öffnen neu
        x: 15 + Math.random() * 70,
        delay: Math.random() * 500,
        duration: 900 + Math.random() * 700,
        drift: (Math.random() - 0.5) * 60,
        size: 3 + Math.random() * 4,
      }))
    );
    this.lightBurst.set(true);
    clearTimeout(this.lightTimer);
    this.lightTimer = setTimeout(() => {
      this.lightBurst.set(false);
      this.sparks.set([]);
    }, LIGHT_BURST_MS);
  }

  /** Ist dieser Gewinn auf die eigene Kalendernummer gefallen? (goldene Hervorhebung) */
  isMine(gewinn: Gewinn): boolean {
    return this.myNumber.isMine(gewinn);
  }

  pad(num: number, size: number): string {
    return num.toString().padStart(size, '0');
  }

  /**
   * Klick auf eine geschlossene Tür: Sie geht ein Stück auf (Klasse "doorClose") und fällt
   * nach 1,3 s wieder zu - ein zweiter Klick schließt sie sofort.
   * Bei Türen zukünftiger Tage knarrt sie dabei wie eine echte Tür (ohne Melodie) und schlägt
   * hörbar zu. Öffnet sich die Tür richtig, kümmert sich der isOpen-Effekt um den Ton.
   */
  toggle(): void {
    if (!this.isOpen()) {
      if (this.keepClose()) {
        clearTimeout(this.timer);
        this.slamShut();
      } else {
        this.keepClose.set(true);
        this.timer = setTimeout(() => this.slamShut(), 1300);
        if (this.isLocked()) {
          this.sound.playOpen({ melody: false });
          this.lightUp(); // auch durch den Spalt strahlt das Licht heraus
        }
      }
    }
  }

  private slamShut(): void {
    this.keepClose.set(false);
    if (this.isLocked() && !this.isOpen()) {
      this.sound.playClose();
      // Tür ist zu: Licht verschwindet mit ihr (bereits aufgestiegene Funken verglimmen noch)
      this.lightBurst.set(false);
    }
  }
}
