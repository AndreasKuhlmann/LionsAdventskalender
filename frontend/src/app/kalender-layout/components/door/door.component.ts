import { Gewinn } from '../../services/gewinn.service';
import {
  Component,
  ElementRef,
  afterRenderEffect,
  input,
  signal,
  viewChild,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'door',
  templateUrl: './door.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  constructor() {
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

  pad(num: number, size: number): string {
    return num.toString().padStart(size, '0');
  }

  toggle(): void {
    if (!this.isOpen()) {
      if (this.keepClose()) {
        clearTimeout(this.timer);
        this.keepClose.set(false);
      } else {
        this.keepClose.set(true);
        this.timer = setTimeout(() => this.keepClose.set(false), 1300);
      }
    }
  }
}
