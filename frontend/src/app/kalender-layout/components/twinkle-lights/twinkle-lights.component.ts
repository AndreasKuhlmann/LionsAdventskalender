import { Component, computed, inject } from '@angular/core';
import { KALENDER_IMAGE_HEIGHT, KALENDER_IMAGE_WIDTH, LightKind, TwinkleLight } from './twinkle-lights';
import { TwinkleLightsService } from './twinkle-lights.service';

interface KindStyle {
  /** Radius des Lichtscheins in Bildpixeln */
  radius: number;
  /** Farbverlauf von innen nach außen */
  inner: string;
  outer: string;
  /** In wie viele unabhängig pulsierende Gruppen die Lichter dieser Art aufgeteilt werden */
  groups: number;
  /** Dauer eines Pulses in s (je Gruppe leicht variiert) */
  duration: number;
}

const KIND_STYLES: Record<LightKind, KindStyle> = {
  kette: { radius: 7, inner: '#fffbe0', outer: '#ffd35a', groups: 4, duration: 1.4 },
  baum: { radius: 8, inner: '#fffbe0', outer: '#ffc94a', groups: 3, duration: 2.2 },
  laterne: { radius: 34, inner: '#fff1b8', outer: '#ffb84a', groups: 2, duration: 4.5 },
  fenster: { radius: 24, inner: '#ffe9a8', outer: '#ffa63a', groups: 1, duration: 0.9 },
};

export interface LightLayer {
  kind: LightKind;
  /** SVG mit den Lichtpunkten dieser Gruppe als CSS-Hintergrund */
  backgroundImage: string;
  duration: number;
  delay: number;
}

/**
 * Lässt die im Kalenderbild gemalten Lichter funkeln.
 *
 * Jede Gruppe von Lichtern ist ein SVG in Bildgröße, das wie das Kalenderbild als Hintergrund
 * liegt (gleiche Skalierung, gleiche Wiederholung nach unten). Dadurch sitzen die Lichter auf
 * Desktop und Handy automatisch genau auf dem Bild. Die Gruppen pulsieren in unterschiedlichem
 * Takt - das wirkt wie unregelmäßiges Funkeln.
 */
@Component({
  selector: 'app-twinkle-lights',
  templateUrl: './twinkle-lights.component.html',
  styleUrls: ['./twinkle-lights.component.scss'],
  host: { 'aria-hidden': 'true' },
})
export class TwinkleLightsComponent {
  private readonly service = inject(TwinkleLightsService);
  /** wird neu berechnet, sobald im Einrichtungsmodus Lichter gesetzt/entfernt werden */
  readonly layers = computed(() => buildLayers(this.service.lights()));
}

export function buildLayers(lights: readonly TwinkleLight[]): LightLayer[] {
  const layers: LightLayer[] = [];
  for (const kind of Object.keys(KIND_STYLES) as LightKind[]) {
    const style = KIND_STYLES[kind];
    const ofKind = lights.filter((l) => l.kind === kind);
    for (let group = 0; group < style.groups; group++) {
      // benachbarte Lichter landen in verschiedenen Gruppen -> sie funkeln nicht im Gleichtakt
      const members = ofKind.filter((_, i) => i % style.groups === group);
      if (members.length === 0) {
        continue;
      }
      layers.push({
        kind,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(toSvg(members, kind, style))}")`,
        duration: style.duration * (0.8 + group * 0.17),
        delay: -group * (style.duration / style.groups),
      });
    }
  }
  return layers;
}

function toSvg(lights: readonly TwinkleLight[], kind: LightKind, style: KindStyle): string {
  const gradient =
    `<radialGradient id="${kind}">` +
    `<stop offset="0" stop-color="${style.inner}" stop-opacity="1"/>` +
    `<stop offset="0.35" stop-color="${style.outer}" stop-opacity="0.75"/>` +
    `<stop offset="1" stop-color="${style.outer}" stop-opacity="0"/>` +
    `</radialGradient>`;
  const circles = lights
    .map((l) => `<circle cx="${l.x}" cy="${l.y}" r="${style.radius}" fill="url(#${kind})"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${KALENDER_IMAGE_WIDTH}" height="${KALENDER_IMAGE_HEIGHT}" ` +
    `viewBox="0 0 ${KALENDER_IMAGE_WIDTH} ${KALENDER_IMAGE_HEIGHT}"><defs>${gradient}</defs>${circles}</svg>`
  );
}
