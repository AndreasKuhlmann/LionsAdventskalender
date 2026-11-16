import { Injectable, computed, signal } from '@angular/core';
import { Gewinn } from './gewinn.service';

const STORAGE_KEY = 'adventskalender.meineKalendernummern';
/** Früherer Schlüssel (nur eine Nummer) - wird beim ersten Laden übernommen. */
const LEGACY_STORAGE_KEY = 'adventskalender.meineKalendernummer';

/** Höchste zulässige Kalendernummer (Plausibilitätsprüfung der Eingabe). */
export const MAX_KALENDERNUMMER = 99999;
/** Wie viele Nummern höchstens hinterlegt werden können. */
export const MAX_ANZAHL_NUMMERN = 50;

export interface AddResult {
  /** neu hinzugefügte Nummern */
  added: number[];
  /** bereits vorhandene Nummern */
  duplicates: number[];
  /** ungültige Eingaben (keine Zahl, außerhalb des gültigen Bereichs) */
  invalid: string[];
  /** wegen der Obergrenze nicht mehr aufgenommene Nummern */
  overLimit: number[];
}

/**
 * Die Kalendernummern (Losnummern) des Nutzers - z.B. für mehrere Kalender in der Familie.
 * Werden ausschließlich lokal im Browser gespeichert und nie an einen Server übertragen.
 */
@Injectable({ providedIn: 'root' })
export class MyNumberService {
  /** aufsteigend sortiert, ohne Duplikate */
  readonly numbers = signal<number[]>(read());
  readonly count = computed(() => this.numbers().length);

  /**
   * Fügt eine oder mehrere Nummern hinzu. Die Eingabe darf mehrere Nummern enthalten,
   * getrennt durch Komma, Semikolon, Leerzeichen oder Zeilenumbruch (z.B. "42, 1234 5678").
   */
  add(input: string): AddResult {
    const result: AddResult = { added: [], duplicates: [], invalid: [], overLimit: [] };
    const current = new Set(this.numbers());

    for (const token of input.split(/[\s,;]+/).filter((t) => t.length > 0)) {
      const value = /^\d+$/.test(token) ? Number(token) : NaN;
      if (!Number.isInteger(value) || value < 1 || value > MAX_KALENDERNUMMER) {
        result.invalid.push(token);
      } else if (current.has(value)) {
        result.duplicates.push(value);
      } else if (current.size >= MAX_ANZAHL_NUMMERN) {
        result.overLimit.push(value);
      } else {
        current.add(value);
        result.added.push(value);
      }
    }

    if (result.added.length > 0) {
      this.save([...current]);
    }
    return result;
  }

  remove(value: number): void {
    this.save(this.numbers().filter((n) => n !== value));
  }

  /** Ist dieser Gewinn auf eine eigene Nummer gefallen? */
  isMine(gewinn: Gewinn, numbers: readonly number[] = this.numbers()): boolean {
    return numbers.includes(gewinn.Losnummer);
  }

  /** Alle Gewinne in der Liste, die auf eine der (angegebenen) eigenen Nummern gefallen sind. */
  winsIn(gewinne: readonly Gewinn[], numbers: readonly number[] = this.numbers()): Gewinn[] {
    return gewinne.filter((g) => this.isMine(g, numbers));
  }

  private save(numbers: number[]): void {
    const sorted = [...new Set(numbers)].sort((a, b) => a - b);
    this.numbers.set(sorted);
    write(sorted);
  }
}

/** Formatiert eine Kalendernummer vierstellig wie auf dem Kalender (z.B. 0042). */
export function formatKalendernummer(value: number): string {
  return value.toString().padStart(4, '0');
}

function read(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter((n): n is number => Number.isInteger(n) && n > 0).sort((a, b) => a - b);
      }
    }
    // Übernahme der früher gespeicherten einzelnen Nummer
    const legacy = Number(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (Number.isInteger(legacy) && legacy > 0) {
      write([legacy]);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return [legacy];
    }
  } catch {
    // ungültige Daten oder kein Zugriff auf den Speicher
  }
  return [];
}

function write(numbers: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(numbers));
  } catch {
    // z.B. privater Modus - gilt dann nur für diese Sitzung
  }
}
