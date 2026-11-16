# Artwork

Originale und Bilder der Vorjahre. Dieser Ordner wird **nicht** deployt.

## Neues Kalenderbild einsetzen

Die App verwendet `src/assets/kalender.jpg` (1200 px breit, JPEG Qualität ca. 85, Ziel < 300 kB).

1. Original hier ablegen (z.B. `kalender2027-original.jpg`).
2. Auf 1200 px Breite skalieren und als `src/assets/kalender.jpg` speichern.
3. Ändert sich das Seitenverhältnis, `aspect-ratio` in
   `src/app/kalender-layout/components/kalender/kalender.component.scss` anpassen.
