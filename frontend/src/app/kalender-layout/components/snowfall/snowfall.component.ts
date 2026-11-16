import { Component } from '@angular/core';

/** Anzahl gleichzeitig fallender Schneeflocken. */
export const FLAKE_COUNT = 100;
const FLAKE_CHARS = ['❅', '❆', '❄'];

interface Flake {
  char: string;
  /** horizontale Position in % der Bildschirmbreite */
  left: number;
  /** Größe in em */
  size: number;
  opacity: number;
  /** Dauer des Herabfallens in s (größere Flocken fallen schneller - wirken näher) */
  fallDuration: number;
  /** negative Verzögerung: die Flocke ist beim Laden schon "unterwegs" */
  fallDelay: number;
  /** Dauer einer Seitwärts-Schaukelbewegung in s */
  swayDuration: number;
  swayDelay: number;
  /** Ausschlag der Schaukelbewegung in px */
  swayDistance: number;
}

/**
 * Fallender Schnee über dem Kalender.
 * Jede Flocke hat zufällige Position, Größe, Geschwindigkeit und Schaukelbewegung.
 * Animiert wird nur "transform" (GPU-freundlich), Klicks gehen durch die Flocken hindurch.
 */
@Component({
  selector: 'app-snowfall',
  templateUrl: './snowfall.component.html',
  styleUrls: ['./snowfall.component.scss'],
  host: { 'aria-hidden': 'true' },
})
export class SnowfallComponent {
  readonly flakes: Flake[] = Array.from({ length: FLAKE_COUNT }, () => {
    const size = 0.6 + Math.random() * 1.1;
    const fallDuration = 16 - size * 5 + Math.random() * 5; // ca. 8-18 s
    const swayDuration = 2.5 + Math.random() * 3;
    return {
      char: FLAKE_CHARS[Math.floor(Math.random() * FLAKE_CHARS.length)],
      left: Math.random() * 100,
      size,
      opacity: 0.45 + Math.random() * 0.5,
      fallDuration,
      fallDelay: -Math.random() * fallDuration,
      swayDuration,
      swayDelay: -Math.random() * swayDuration,
      swayDistance: 20 + Math.random() * 60,
    };
  });
}
