/**
 * Kurze Anfangsphrasen traditioneller (gemeinfreier) Weihnachtslieder.
 *
 * Notation: "Ton+Oktave:Dauer", durch Leerzeichen getrennt.
 *   - Ton: C D E F G A B, optional mit # (Kreuz) oder b (Be), z.B. "F#4", "Bb3"
 *   - Dauer in Viertelnoten: 1 = Viertel, 0.5 = Achtel, 2 = Halbe, 1.5 = punktierte Viertel
 *   - "R:1" = Pause
 * Gespielt wird in der notierten Tonhöhe (Klavier, siehe DoorSoundService).
 */
export interface Melody {
  title: string;
  /** Viertelnoten pro Minute */
  bpm: number;
  notes: string;
}

export const CHRISTMAS_MELODIES: readonly Melody[] = [
  {
    title: 'Jingle Bells',
    bpm: 180,
    notes: 'E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:0.5 E4:4',
  },
  {
    title: 'Stille Nacht',
    bpm: 110,
    notes: 'G4:1.5 A4:0.5 G4:1 E4:3 G4:1.5 A4:0.5 G4:1 E4:3',
  },
  {
    title: 'O Tannenbaum',
    bpm: 120,
    notes: 'D4:1 G4:0.75 G4:0.25 G4:1.5 A4:0.5 B4:0.75 B4:0.25 B4:1.5 B4:0.5 A4:0.5 B4:0.5 C5:1 F#4:1 A4:1 G4:2',
  },
  {
    title: 'Morgen kommt der Weihnachtsmann',
    bpm: 150,
    notes: 'C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2',
  },
  {
    title: 'We Wish You a Merry Christmas',
    bpm: 190,
    notes:
      'D4:1 G4:1 G4:0.5 A4:0.5 G4:0.5 F#4:0.5 E4:1 E4:1 E4:1 A4:1 A4:0.5 B4:0.5 A4:0.5 G4:0.5 F#4:1 D4:1 D4:1 ' +
      'B4:1 B4:0.5 C5:0.5 B4:0.5 A4:0.5 G4:1 E4:1 D4:0.5 D4:0.5 E4:1 A4:1 F#4:1 G4:2',
  },
  {
    title: 'Deck the Halls',
    bpm: 150,
    notes: 'G4:1.5 F4:0.5 E4:1 D4:1 C4:1 D4:1 E4:1 C4:1 D4:0.5 E4:0.5 F4:0.5 D4:0.5 E4:1.5 D4:0.5 C4:1 B3:1 C4:2',
  },
  {
    title: 'Joy to the World',
    bpm: 120,
    notes: 'C5:1 B4:0.75 A4:0.25 G4:1.5 F4:0.5 E4:1 D4:1 C4:2',
  },
  {
    title: 'Hark! The Herald Angels Sing',
    bpm: 140,
    notes: 'D4:1 G4:1 G4:1.5 F#4:0.5 G4:1 B4:1 B4:1 A4:2 D5:1 D5:1 D5:1.5 C5:0.5 B4:1 A4:1 B4:2',
  },
  {
    title: 'Good King Wenceslas',
    bpm: 140,
    notes: 'G4:1 G4:1 G4:1 A4:1 G4:1 G4:1 D4:2 E4:1 D4:1 E4:1 F#4:1 G4:2 G4:2',
  },
  {
    title: 'God Rest Ye Merry, Gentlemen',
    bpm: 150,
    notes: 'E4:1 E4:1 B4:1 B4:1 A4:1 G4:1 F#4:1 E4:1 D4:1 E4:1 F#4:1 G4:1 A4:1 B4:3',
  },
];

export interface ParsedNote {
  /** Frequenz in Hz, null = Pause */
  frequency: number | null;
  /** Dauer in Sekunden */
  duration: number;
}

const SEMITONES: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

/** Wandelt einen Ton wie "F#4" in die Frequenz um (A4 = 440 Hz). */
export function noteToFrequency(note: string): number {
  const match = /^([A-G])([#b]?)(\d)$/.exec(note);
  if (!match) {
    throw new Error(`Ungültiger Ton: ${note}`);
  }
  const [, name, accidental, octave] = match;
  const semitone =
    SEMITONES[name] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + (Number(octave) - 4) * 12;
  return 440 * Math.pow(2, semitone / 12);
}

/** Zerlegt eine Melodie in Töne mit Frequenz und Dauer in Sekunden. */
export function parseMelody(melody: Melody): ParsedNote[] {
  const beat = 60 / melody.bpm;
  return melody.notes
    .trim()
    .split(/\s+/)
    .map((token) => {
      const [pitch, length] = token.split(':');
      const beats = Number(length);
      if (!(beats > 0)) {
        throw new Error(`Ungültige Dauer in "${token}" (${melody.title})`);
      }
      return {
        frequency: pitch === 'R' ? null : noteToFrequency(pitch),
        duration: beats * beat,
      };
    });
}
