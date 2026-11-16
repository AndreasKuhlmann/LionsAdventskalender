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

@Component({
  selector: 'door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss'],
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

  constructor() {
    // Ton (und ggf. Gewinn-Feier) beim Öffnen/Schließen - aber nicht beim ersten Anzeigen
    // (bereits geöffnete Türen werden beim Laden aus dem Speicher wiederhergestellt).
    let wasOpen: boolean | undefined;
    effect(() => {
      const open = this.isOpen();
      if (wasOpen !== undefined && open !== wasOpen) {
        untracked(() => {
          if (open) {
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
      },
    });
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
        }
      }
    }
  }

  private slamShut(): void {
    this.keepClose.set(false);
    if (this.isLocked() && !this.isOpen()) {
      this.sound.playClose();
    }
  }
}
