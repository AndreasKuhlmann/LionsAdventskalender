/**
 * Funkelnde Lichter über dem Kalenderbild.
 *
 * Die Punkte liegen auf den im Bild gemalten Lichtern und gelten NUR für das aktuelle Motiv
 * (src/assets/kalender.jpg). Bei einem neuen Bild die Liste anpassen oder leeren -
 * eine leere Liste zeigt einfach keine Lichter an.
 *
 * Bequem einrichten: App mit "ng serve" starten, in der Toolbar auf ✨ klicken, Lichter ins
 * Bild klicken, "Liste kopieren" und damit TWINKLE_LIGHTS unten ersetzen.
 *
 * Koordinaten in Pixeln des Originalbildes (KALENDER_IMAGE_WIDTH x KALENDER_IMAGE_HEIGHT),
 * Ursprung oben links.
 */

export const KALENDER_IMAGE_WIDTH = 1200;
export const KALENDER_IMAGE_HEIGHT = 847;

/**
 * - kette:   kleine Lämpchen einer Lichterkette, funkeln schnell und unregelmäßig
 * - baum:    Lichter am Tannenbaum, blinken etwas langsamer
 * - laterne: leuchtende Schilder/Laternen, "atmen" langsam heller und dunkler
 * - fenster: erleuchtete Fenster, flackern leicht wie Kerzenlicht
 */
export type LightKind = 'kette' | 'baum' | 'laterne' | 'fenster';

export interface TwinkleLight {
  x: number;
  y: number;
  kind: LightKind;
}

/** Motiv 2026: Weihnachtsmarkt vor der Lambertikirche */
export const TWINKLE_LIGHTS: readonly TwinkleLight[] = [
  // Lichterketten
  { x: 345, y: 520, kind: 'kette' },
  { x: 370, y: 505, kind: 'kette' },
  { x: 395, y: 490, kind: 'kette' },
  { x: 420, y: 476, kind: 'kette' },
  { x: 445, y: 462, kind: 'kette' },
  { x: 470, y: 449, kind: 'kette' },
  { x: 495, y: 438, kind: 'kette' },
  { x: 520, y: 429, kind: 'kette' },
  { x: 545, y: 424, kind: 'kette' },
  { x: 570, y: 428, kind: 'kette' },
  { x: 595, y: 437, kind: 'kette' },
  { x: 620, y: 449, kind: 'kette' },
  { x: 645, y: 462, kind: 'kette' },
  { x: 670, y: 477, kind: 'kette' },
  { x: 690, y: 492, kind: 'kette' },
  { x: 340, y: 570, kind: 'kette' },
  { x: 370, y: 574, kind: 'kette' },
  { x: 400, y: 571, kind: 'kette' },
  { x: 430, y: 576, kind: 'kette' },
  { x: 460, y: 572, kind: 'kette' },
  { x: 490, y: 577, kind: 'kette' },
  { x: 520, y: 573, kind: 'kette' },
  { x: 550, y: 578, kind: 'kette' },
  { x: 580, y: 574, kind: 'kette' },
  { x: 610, y: 577, kind: 'kette' },
  { x: 640, y: 573, kind: 'kette' },
  { x: 670, y: 578, kind: 'kette' },
  { x: 700, y: 574, kind: 'kette' },
  { x: 730, y: 576, kind: 'kette' },
  { x: 700, y: 522, kind: 'kette' },
  { x: 730, y: 518, kind: 'kette' },
  { x: 760, y: 514, kind: 'kette' },
  { x: 790, y: 510, kind: 'kette' },
  { x: 820, y: 506, kind: 'kette' },
  { x: 850, y: 503, kind: 'kette' },
  { x: 880, y: 500, kind: 'kette' },
  { x: 910, y: 498, kind: 'kette' },
  { x: 940, y: 496, kind: 'kette' },
  { x: 970, y: 494, kind: 'kette' },
  { x: 1000, y: 492, kind: 'kette' },
  { x: 1030, y: 490, kind: 'kette' },
  { x: 1060, y: 489, kind: 'kette' },
  { x: 1090, y: 488, kind: 'kette' },
  { x: 1120, y: 487, kind: 'kette' },
  { x: 1150, y: 486, kind: 'kette' },
  { x: 1180, y: 485, kind: 'kette' },
  { x: 10, y: 490, kind: 'kette' },
  { x: 35, y: 488, kind: 'kette' },
  { x: 60, y: 489, kind: 'kette' },
  { x: 85, y: 491, kind: 'kette' },
  { x: 110, y: 493, kind: 'kette' },
  { x: 135, y: 496, kind: 'kette' },
  { x: 10, y: 565, kind: 'kette' },
  { x: 40, y: 566, kind: 'kette' },
  { x: 70, y: 567, kind: 'kette' },
  { x: 100, y: 568, kind: 'kette' },
  // Tannenbäume
  { x: 175, y: 560, kind: 'baum' },
  { x: 165, y: 585, kind: 'baum' },
  { x: 190, y: 580, kind: 'baum' },
  { x: 160, y: 610, kind: 'baum' },
  { x: 185, y: 605, kind: 'baum' },
  { x: 205, y: 598, kind: 'baum' },
  { x: 170, y: 630, kind: 'baum' },
  { x: 195, y: 625, kind: 'baum' },
  { x: 150, y: 640, kind: 'baum' },
  { x: 607, y: 485, kind: 'baum' },
  { x: 600, y: 505, kind: 'baum' },
  { x: 615, y: 500, kind: 'baum' },
  { x: 597, y: 525, kind: 'baum' },
  { x: 618, y: 522, kind: 'baum' },
  // Schilder, Laternen, Auslagen
  { x: 1040, y: 345, kind: 'laterne' },
  { x: 1080, y: 130, kind: 'laterne' },
  { x: 1060, y: 410, kind: 'laterne' },
  { x: 548, y: 470, kind: 'laterne' },
  { x: 450, y: 522, kind: 'laterne' },
  { x: 1130, y: 565, kind: 'laterne' },
  { x: 950, y: 570, kind: 'laterne' },
  // erleuchtete Fenster
  { x: 598, y: 375, kind: 'fenster' },
  { x: 282, y: 560, kind: 'fenster' },
];
