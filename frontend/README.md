# Oldenburger Adventskalender – Frontend

Angular-App (Angular 22, Standalone-Komponenten, Signals, zoneless) für den Online-Adventskalender der Oldenburger Lions Clubs. Die App ist als PWA installierbar.

## Voraussetzungen

- **Node.js** 22.22 oder neuer bzw. 24.15 oder neuer
- Abhängigkeiten installieren:

  ```
  npm install
  ```

Die Angular CLI muss nicht global installiert sein. Statt `ng …` funktioniert auch `npx ng …`.

## Entwicklung

```
ng serve
```

Danach `http://localhost:4200/` öffnen. Bei Änderungen an den Quelldateien lädt die App automatisch neu.

- **Backend:** Im Entwicklungsmodus holt die App die Gewinne von `http://localhost:7071/api/Gewinne/`, also von den lokal laufenden Azure Functions aus dem Ordner `backend`. Um stattdessen das Live-Backend zu verwenden, in [`src/environments/environment.ts`](src/environments/environment.ts) die URL umstellen.
- **Service Worker:** Bei `ng serve` ist er abgeschaltet. Offline-Betrieb und Update-Verhalten lassen sich nur mit einem Produktions-Build testen (siehe [Updates und PWA](#updates-und-pwa)).

## Neue Komponenten anlegen

```
ng generate component komponenten-name
```

Komponenten werden als Standalone-Komponenten angelegt. Mit `ng generate service|directive|pipe|…` lassen sich auch andere Bausteine erzeugen.

## Build

```
ng build
```

Das Ergebnis liegt in `dist/advents-kalender/browser`.

## Tests

```
ng test
```

Führt die Unit-Tests mit [Vitest](https://vitest.dev) aus (DOM-Simulation über jsdom). Mit `ng test --watch=false` laufen die Tests einmal durch, ohne auf Änderungen zu warten.

## Deployment

Die App wird in den Container `$web` des Azure Storage Accounts `kalender` hochgeladen und über Cloudflare unter `www.oldenburger-adventskalender.de` ausgeliefert.

### Mit `deploy.cmd`

Das Skript setzt passende Cache-Header und lädt `ngsw.json` als letzte Datei hoch. Der SAS-Token steht **nicht** in der Datei, sondern wird als Umgebungsvariable übergeben (nur der Teil nach dem `?`, in Anführungszeichen):

```
ng build
set "KALENDER_SAS=sv=...&sig=..."
deploy.cmd
```

Voraussetzungen: `azcopy` im Pfad bzw. im Ordner `frontend` und `az login`.

### Von Hand (Azure-Extension in VS Code oder Azure Storage Explorer)

- Erst **alle Dateien außer `ngsw.json`** hochladen, dann **`ngsw.json` zuletzt**. Sonst sehen die Service Worker der Nutzer die neue Version, bevor alle Dateien da sind, und das Update verzögert sich.
- Alte Dateien möglichst **nicht löschen**. Nutzer mit der Vorversion laden sonst Dateien nach, die es nicht mehr gibt. Die App fängt das zwar ab und lädt neu, schöner ist es aber ohne.

### Cloudflare

Die Cache-Header sollten in Cloudflare per Regel gesetzt sein, dann gelten sie unabhängig vom Upload-Weg:

| Dateien | Cloudflare-Cache | `Cache-Control` |
|---|---|---|
| `/`, `/index.html`, `/ngsw.json`, `/ngsw-worker.js`, `/safety-worker.js`, `/worker-basic.min.js`, `/manifest.webmanifest` | umgehen | `no-cache` |
| gehashte Bundles `main-…`, `chunk-…`, `styles-…`, `polyfills-…` | 1 Jahr | `max-age=31536000` |

Nach dem Austausch des Kalenderbildes (gleicher Dateiname) die URL `/assets/kalender.jpg` in Cloudflare per *Custom Purge* leeren.

## Updates und PWA

- Die installierte App sucht nach einer neuen Version, sobald sie wieder in den Vordergrund kommt, und zusätzlich alle 15 Minuten.
- Ist eine neue Version bereit, erscheint eine Meldung „Neu laden“. Lief die App im Hintergrund, wird beim Zurückkehren automatisch neu geladen.
- **Update-Verhalten testen:** `ng build`, dann `dist/advents-kalender/browser` über einen lokalen HTTP-Server ausliefern (z. B. `npx http-server dist/advents-kalender/browser`), eine Änderung bauen, Dateien ersetzen und zur offenen App zurückwechseln.

## Funkelnde Lichter im Kalenderbild einrichten

Über dem Kalenderbild funkeln die im Motiv gemalten Lichter (Lichterketten, Tannenbäume, Laternen, Fenster). Die Positionen der Lichtpunkte gelten nur für das jeweilige Motiv und stehen in
[`src/app/kalender-layout/components/twinkle-lights/twinkle-lights.ts`](src/app/kalender-layout/components/twinkle-lights/twinkle-lights.ts) in der Liste `TWINKLE_LIGHTS`. Ist die Liste leer, wird einfach nichts angezeigt.

Zum Setzen der Punkte gibt es einen **Einrichtungsmodus**. Er ist nur verfügbar, wenn die App lokal mit `ng serve` läuft. In der veröffentlichten App (`ng build`) ist der Button ausgeblendet, und der Editor wird nie geladen.

### So geht's

1. App lokal starten: `ng serve`, dann `http://localhost:4200/` öffnen.
2. In der Toolbar auf **✨** klicken. Das Symbol leuchtet gelb, solange der Modus aktiv ist.
3. Im Bedienfeld unten links die **Art** wählen:

   | Art | Markierung | Wirkung |
   |---|---|---|
   | Lichterkette | türkis | schnelles, unregelmäßiges Funkeln |
   | Tannenbaum | grün | ruhigeres Blinken |
   | Laterne / Schild | magenta | großer Lichtschein, langsames „Atmen“ |
   | Fenster | gelb | leichtes Kerzenflackern |

4. **Ins Bild klicken** setzt ein Licht der gewählten Art. **Auf ein vorhandenes Licht klicken** entfernt es. Das Funkeln ist sofort zu sehen. Mit „Markierungen anzeigen“ lassen sich die farbigen Ringe ausblenden, um nur den Effekt zu beurteilen.
5. **Liste kopieren** und in `twinkle-lights.ts` die komplette Liste `TWINKLE_LIGHTS` durch den kopierten Code ersetzen.
6. **Fertig** beendet den Modus.

Weitere Schaltflächen:

- **Verwerfen:** alle Änderungen verwerfen und wieder den Stand aus `twinkle-lights.ts` laden.
- **Alle löschen:** alle Lichter entfernen, z. B. für ein neues Motiv.
- **🎄 Heiligabend vorführen** (Abschnitt „Testen“): startet die Weihnachtsszene von Tür 24 zur Vorschau, siehe [Heiligabend-Special](#heiligabend-special-tür-24).

Hinweise:

- Änderungen werden als **Entwurf** im Browser gespeichert und überstehen ein Neuladen der Seite. Teil der App werden sie erst, wenn der kopierte Code in `twinkle-lights.ts` eingefügt ist.
- Geklickt werden kann auch in der Handy-Ansicht, in der das Bild 24-mal untereinander steht. Jeder Klick wird auf das Originalbild umgerechnet.
- Koordinaten werden in Pixeln des Originalbildes (1200 × 847) gespeichert. Hat ein neues Motiv eine andere Größe, müssen `KALENDER_IMAGE_WIDTH` und `KALENDER_IMAGE_HEIGHT` in `twinkle-lights.ts` angepasst werden.
- Farbe, Größe und Tempo je Lichtart stehen in `KIND_STYLES` in `twinkle-lights.component.ts`, die Stärke des Funkelns in den `@keyframes` von `twinkle-lights.component.scss`.

## Neues Kalenderbild für ein neues Jahr

1. Bild einsetzen wie in [`artwork/README.md`](artwork/README.md) beschrieben, als `src/assets/kalender.jpg`.
2. Ändert sich das Seitenverhältnis, an drei Stellen anpassen (bisher 1200 × 847):
   - `aspect-ratio` in `kalender.component.scss`
   - die Mindesthöhe `(rect.width * 847) / 1200` in `kalender.component.ts`
   - `KALENDER_IMAGE_WIDTH`/`KALENDER_IMAGE_HEIGHT` in `twinkle-lights.ts`
3. Lichter neu einrichten (siehe oben): **Alle löschen**, Lichter setzen, **Liste kopieren**, in `twinkle-lights.ts` einfügen.
4. Nach dem Deployment das Bild in Cloudflare per *Custom Purge* leeren (siehe [Cloudflare](#cloudflare)).
5. Den Weihnachtsgruß und die Spendensumme für Heiligabend aktualisieren (siehe [Heiligabend-Special](#heiligabend-special-tür-24)).

## Heiligabend-Special (Tür 24)

Tür 24 hat schon vor Heiligabend einen goldenen Rahmen und eine goldene Nummer. Beim Öffnen passiert Folgendes:

1. Zwei **Kirchenglocken** läuten im Wechsel, statt des normalen Knarrens.
2. **„Stille Nacht“** erklingt als ganze erste Strophe (ca. 40 Sekunden) auf dem Klavier.
3. Der Bildschirm wird zum **Nachthimmel** mit funkelndem **Stern von Bethlehem**. Es schneit dichter, und die funkelnden Lichter im Bild leuchten kräftiger.
4. Ein **Weihnachtsgruß** erscheint.

Die Szene endet automatisch kurz nach dem Lied oder über **„Schließen“** bzw. die Escape-Taste. Hat eine eigene Kalendernummer an Heiligabend gewonnen, kommen zuerst Konfetti, Fanfare und Glückwunsch-Dialog, nach dem Schließen des Dialogs folgt die Weihnachtsszene.

Vom 25. Dezember bis Ende Januar erscheint statt des Tipps zur Kalendernummer einmal pro Sitzung der Hinweis „Frohe Weihnachten – wir sehen uns im nächsten Advent!“.

### Texte anpassen

Titel, Grußtext, Unterschrift und Spendensumme stehen in
[`src/app/kalender-layout/components/christmas-eve/christmas-eve.texts.ts`](src/app/kalender-layout/components/christmas-eve/christmas-eve.texts.ts).

- **`spendensumme`:** z. B. `'35.000 €'`. Dann erscheint zusätzlich „Gemeinsam sind in diesem Jahr 35.000 € für den guten Zweck zusammengekommen.“ Bei `null` fehlt dieser Satz.
- Den Text am besten jedes Jahr prüfen.

### Vorab ansehen mit dem Test-Button

Tür 24 lässt sich erst öffnen, wenn für Tag 24 Gewinne gezogen sind. Damit man die Szene vorher prüfen kann, gibt es einen Test-Button. Er ist, wie der Einrichtungsmodus der Lichter, **nur verfügbar, wenn die App lokal mit `ng serve` läuft**.

1. App lokal starten: `ng serve`, dann `http://localhost:4200/` öffnen.
2. In der Toolbar auf **✨** klicken. Unten links öffnet sich das Bedienfeld.
3. Im Abschnitt **„Testen“** auf **„🎄 Heiligabend vorführen“** klicken.
4. Das Bedienfeld schließt sich, und die komplette Szene startet: Glocken, „Stille Nacht“, Nachthimmel mit Stern, dichterer Schnee, hellere Lichter und Weihnachtsgruß.
5. Beenden über **„Schließen“** oder die Escape-Taste. Sonst endet die Szene nach dem Lied von selbst.

Hinweise:

- Kann der Browser keinen Ton abspielen, läuft die Szene ohne Glocken und Musik und endet nach etwa 30 Sekunden.
- Den Ablauf „Gewinn an Heiligabend“ (erst Konfetti, dann die Szene) kann der Button nicht vorführen. Dafür muss das lokale Backend für Tag 24 einen Gewinn mit Losnummer liefern, und diese Nummer muss als eigene Kalendernummer hinterlegt sein.

## Weitere Hilfe

- `ng help` zeigt alle Befehle der Angular CLI.
- Dokumentation der Angular CLI: [angular.dev/cli](https://angular.dev/cli)
