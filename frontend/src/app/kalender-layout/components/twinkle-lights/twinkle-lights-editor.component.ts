import { Component, computed, inject, signal } from '@angular/core';
import { KALENDER_IMAGE_HEIGHT, KALENDER_IMAGE_WIDTH, LightKind, TwinkleLight } from './twinkle-lights';
import { LIGHT_KIND_LABELS, TwinkleLightsService } from './twinkle-lights.service';
import { ChristmasEveService } from '../../services/christmas-eve.service';

/** Farben der Markierungen im Einrichtungsmodus */
const MARKER_COLORS: Record<LightKind, string> = {
  kette: '#00e5ff',
  baum: '#76ff03',
  laterne: '#ff40ff',
  fenster: '#ffea00',
};

const MARKER_RADIUS: Record<LightKind, number> = { kette: 6, baum: 7, laterne: 30, fenster: 22 };

/**
 * Einrichtungsmodus für die funkelnden Lichter (nur bei "ng serve").
 * Klick ins Bild setzt ein Licht der gewählten Art, Klick auf ein vorhandenes Licht entfernt es.
 * Die fertige Liste wird kopiert und in twinkle-lights.ts eingefügt.
 */
@Component({
  selector: 'app-twinkle-lights-editor',
  templateUrl: './twinkle-lights-editor.component.html',
  styleUrls: ['./twinkle-lights-editor.component.scss'],
})
export class TwinkleLightsEditorComponent {
  readonly service = inject(TwinkleLightsService);
  private readonly christmasEve = inject(ChristmasEveService);

  readonly kinds = Object.keys(LIGHT_KIND_LABELS) as LightKind[];
  readonly labels = LIGHT_KIND_LABELS;
  readonly colors = MARKER_COLORS;

  readonly showMarkers = signal(true);
  readonly copyMessage = signal<string | null>(null);

  readonly markers = computed(() =>
    this.showMarkers() ? buildMarkerBackground(this.service.lights()) : 'none'
  );

  readonly countByKind = computed(() => {
    const counts: Record<LightKind, number> = { kette: 0, baum: 0, laterne: 0, fenster: 0 };
    for (const l of this.service.lights()) {
      counts[l.kind]++;
    }
    return counts;
  });

  /** Klick ins Bild -> Bildkoordinaten (das Bild wiederholt sich nach unten). */
  onAreaClick(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const imageHeightOnScreen = (rect.width * KALENDER_IMAGE_HEIGHT) / KALENDER_IMAGE_WIDTH;
    const xOnScreen = event.clientX - rect.left;
    const yOnScreen = (event.clientY - rect.top) % imageHeightOnScreen;
    this.service.toggleLightAt(
      (xOnScreen / rect.width) * KALENDER_IMAGE_WIDTH,
      (yOnScreen / imageHeightOnScreen) * KALENDER_IMAGE_HEIGHT
    );
  }

  async copy(): Promise<void> {
    const code = this.service.exportAsCode();
    try {
      await navigator.clipboard.writeText(code);
      this.copyMessage.set('Kopiert! In twinkle-lights.ts die Liste TWINKLE_LIGHTS damit ersetzen.');
    } catch {
      console.log(code);
      this.copyMessage.set('Kopieren nicht möglich – der Code steht in der Browser-Konsole (F12).');
    }
  }

  clearAll(): void {
    if (confirm('Wirklich alle Lichter entfernen?')) {
      this.service.clearAll();
    }
  }

  /**
   * Nur zum Testen bei "ng serve": startet die Heiligabend-Szene (Glocken, "Stille Nacht",
   * Stern, Weihnachtsgruß), ohne dass Tür 24 schon geöffnet werden kann.
   * Das Bedienfeld wird dafür geschlossen, damit es nicht über der Szene liegt.
   */
  demoChristmasEve(): void {
    this.service.toggleEditMode();
    this.christmasEve.start();
  }

  resetToFile(): void {
    if (confirm('Alle Änderungen verwerfen und den Stand aus twinkle-lights.ts laden?')) {
      this.service.resetToFile();
      this.copyMessage.set(null);
    }
  }
}

/** Ringe um alle Lichter, als Hintergrund in Bildgröße (wiederholt sich wie das Bild). */
function buildMarkerBackground(lights: readonly TwinkleLight[]): string {
  const circles = lights
    .map(
      (l) =>
        `<circle cx="${l.x}" cy="${l.y}" r="${MARKER_RADIUS[l.kind]}" fill="none" ` +
        `stroke="${MARKER_COLORS[l.kind]}" stroke-width="2.5"/>` +
        `<circle cx="${l.x}" cy="${l.y}" r="1.5" fill="${MARKER_COLORS[l.kind]}"/>`
    )
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${KALENDER_IMAGE_WIDTH}" height="${KALENDER_IMAGE_HEIGHT}" ` +
    `viewBox="0 0 ${KALENDER_IMAGE_WIDTH} ${KALENDER_IMAGE_HEIGHT}">${circles}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
