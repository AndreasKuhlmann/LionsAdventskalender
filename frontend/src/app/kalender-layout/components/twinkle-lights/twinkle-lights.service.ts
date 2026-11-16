import { Injectable, isDevMode, signal } from '@angular/core';
import { LightKind, TWINKLE_LIGHTS, TwinkleLight } from './twinkle-lights';

/** Entwurf aus dem Einrichtungsmodus - übersteht ein Neuladen der Seite (nur bei "ng serve"). */
const DRAFT_STORAGE_KEY = 'adventskalender.lichterEntwurf';

/** Klick innerhalb dieses Abstands (in Bildpixeln) auf ein vorhandenes Licht entfernt es. */
export const REMOVE_DISTANCE = 14;

export const LIGHT_KIND_LABELS: Record<LightKind, string> = {
  kette: 'Lichterkette',
  baum: 'Tannenbaum',
  laterne: 'Laterne / Schild',
  fenster: 'Fenster',
};

/**
 * Die funkelnden Lichter im Kalenderbild und der Einrichtungsmodus zum Setzen der Punkte.
 * Der Einrichtungsmodus ist nur bei "ng serve" (Entwicklungsmodus) verfügbar.
 */
@Injectable({ providedIn: 'root' })
export class TwinkleLightsService {
  /** Steht der Einrichtungsmodus zur Verfügung? (nur lokal mit "ng serve") */
  readonly editorAvailable = isDevMode();

  readonly editMode = signal(false);
  readonly selectedKind = signal<LightKind>('kette');
  readonly lights = signal<readonly TwinkleLight[]>(
    (this.editorAvailable && readDraft()) || TWINKLE_LIGHTS
  );

  /** Gibt es ungespeicherte Änderungen gegenüber twinkle-lights.ts? */
  readonly hasDraft = signal(this.lights() !== TWINKLE_LIGHTS);

  toggleEditMode(): void {
    if (this.editorAvailable) {
      this.editMode.update((on) => !on);
    }
  }

  /**
   * Klick ins Bild (Koordinaten in Bildpixeln): entfernt ein Licht in der Nähe
   * oder setzt ein neues der gewählten Art.
   */
  toggleLightAt(x: number, y: number): void {
    const lights = this.lights();
    const nearest = findNearest(lights, x, y);
    if (nearest !== undefined) {
      this.update(lights.filter((l) => l !== nearest));
    } else {
      this.update([...lights, { x: Math.round(x), y: Math.round(y), kind: this.selectedKind() }]);
    }
  }

  clearAll(): void {
    this.update([]);
  }

  /** Verwirft den Entwurf und lädt wieder den Stand aus twinkle-lights.ts. */
  resetToFile(): void {
    this.lights.set(TWINKLE_LIGHTS);
    this.hasDraft.set(false);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignorieren
    }
  }

  /** Die aktuelle Liste als TypeScript-Code zum Einfügen in twinkle-lights.ts. */
  exportAsCode(): string {
    return formatLightsAsCode(this.lights());
  }

  private update(lights: readonly TwinkleLight[]): void {
    this.lights.set(lights);
    this.hasDraft.set(true);
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(lights));
    } catch {
      // ignorieren
    }
  }
}

function findNearest(lights: readonly TwinkleLight[], x: number, y: number): TwinkleLight | undefined {
  let best: TwinkleLight | undefined;
  let bestDistance = REMOVE_DISTANCE;
  for (const light of lights) {
    const distance = Math.hypot(light.x - x, light.y - y);
    if (distance <= bestDistance) {
      best = light;
      bestDistance = distance;
    }
  }
  return best;
}

/** Erzeugt den Code für TWINKLE_LIGHTS - nach Art gruppiert, ein Licht pro Zeile. */
export function formatLightsAsCode(lights: readonly TwinkleLight[]): string {
  const lines = ['export const TWINKLE_LIGHTS: readonly TwinkleLight[] = ['];
  for (const kind of Object.keys(LIGHT_KIND_LABELS) as LightKind[]) {
    const ofKind = lights.filter((l) => l.kind === kind);
    if (ofKind.length === 0) {
      continue;
    }
    lines.push(`  // ${LIGHT_KIND_LABELS[kind]}`);
    for (const l of ofKind) {
      lines.push(`  { x: ${l.x}, y: ${l.y}, kind: '${l.kind}' },`);
    }
  }
  lines.push('];');
  return lines.join('\n');
}

function readDraft(): readonly TwinkleLight[] | null {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.filter(
      (l): l is TwinkleLight =>
        typeof l?.x === 'number' && typeof l?.y === 'number' && l?.kind in LIGHT_KIND_LABELS
    );
  } catch {
    return null;
  }
}
