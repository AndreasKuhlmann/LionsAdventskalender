# CLAUDE.md – Oldenburger Adventskalender (Frontend)

Online-Adventskalender der Oldenburger Lions Clubs. Angular-PWA, Backend (Azure Functions, .NET) liegt in `../backend`.
Ausführliche Doku für Menschen: [README.md](README.md). Diese Datei enthält das, was Claude für die Arbeit wissen muss.

## Sprache

- Kommunikation mit dem Nutzer, UI-Texte und Code-Kommentare: **Deutsch**.
- Bezeichner im Code: Englisch (bestehende Fachbegriffe wie `Gewinn`, `TagesGewinne`, `Losnummer` beibehalten).

## Befehle

- `ng serve` – Entwicklung (`http://localhost:4200`), nutzt lokales Backend `http://localhost:7071/api/Gewinne/` (siehe `src/environments/environment.ts`). Service Worker ist dabei aus.
- `ng build` – Produktion nach `dist/advents-kalender/browser`.
- `ng test --watch=false` – Vitest + jsdom. Nach jeder Änderung Build **und** Tests laufen lassen.

## Technik / Konventionen

- Angular 22, **Standalone**-Komponenten, **Signals** (`input()`, `output()`, `viewChild()`, `signal`, `computed`), **zoneless**, **OnPush** ist Standard. Keine NgModules, kein `zone.js`, kein `NgZone`.
- Zustand, der im Template landet, muss ein Signal oder Input sein (sonst aktualisiert die Anzeige nicht). Daten im `GewinnService` werden **unveränderlich** aktualisiert (`update(...)` mit neuen Objekten); in `@for` über Türen `track tagesGewinn.Tag`.
- DOM-Messungen nach dem Rendern mit `afterRenderEffect` (siehe `door.component.ts`).
- Funktionen nur für die Entwicklung über `isDevMode()` schalten (z.B. `TwinkleLightsService.editorAvailable`) und per `@defer` nachladen, damit sie nicht im Produktions-Bundle landen.
- Tests: Browser-APIs, die jsdom nicht kennt (`matchMedia`, `ResizeObserver`, `AudioContext`), mit `vi.stubGlobal` ersetzen; Ionic `Storage` und HTTP (`provideHttpClientTesting`) mocken.
- Budgets in `angular.json`: Initial-Bundle-Warnung bei 500 kB (liegt aktuell knapp darüber, bekannt), Komponenten-Styles 4 kB Warnung / 8 kB Fehler. Größere Styles in eigene Dateien auslagern (z.B. `door-light.scss`, `door-24.scss`).

## Wo was ist (`src/app/kalender-layout/`)

| Thema | Dateien |
|---|---|
| Kalender, Türen, Layout (Desktop / Mobil+Tablet bis 1024 px: Bild 24x untereinander, je eine Tür mittig) | `components/kalender/`, `components/door/` |
| Gewinne laden/öffnen (einmal täglich neu laden, Datumsvergleich per `toDateString()`) | `services/gewinn.service.ts` |
| Töne (synthetisch per Web Audio): Knarren, Quietschen, Klack, Melodien (Klavier/Glockenspiel im Wechsel), Fanfare, Kirchenglocken | `services/door-sound.service.ts`, `services/christmas-melodies.ts` |
| „Habe ich gewonnen?“ – mehrere Kalendernummern (nur lokal gespeichert), Konfetti, Glückwunsch-Dialog | `services/my-number.service.ts`, `services/winner.service.ts`, `services/confetti.service.ts`, `components/my-number-dialog/`, `components/winner-dialog/` |
| Schnee | `components/snowfall/` |
| Licht/Funken beim Öffnen | `components/door/door-light.scss`, `lightUp()` in `door.component.ts` |
| Funkelnde Lichter im Bild + Einrichtungsmodus (✨ in der Toolbar, nur `ng serve`) | `components/twinkle-lights/` |
| Heiligabend-Special Tür 24 (Glocken, „Stille Nacht“, Stern, Gruß; Texte/Spendensumme) | `services/christmas-eve.service.ts`, `components/christmas-eve/` (`christmas-eve.texts.ts`) |
| PWA-Update, Installation | `../services/app-update.service.ts`, `services/installable-prompt.service.ts`, `ngsw-config.json`, `src/manifest.webmanifest` |

## Festgelegte Entscheidungen des Nutzers

- **Ton und Vibration sind immer an** – es gibt bewusst **keinen** Stumm-Button. Auf iOS wird `navigator.audioSession.type = 'playback'` gesetzt (Ton auch bei lautlos), erst beim ersten Tür-Geräusch.
- Melodien: kurze Zufallsmelodien abwechselnd Klavier/Glockenspiel; „Stille Nacht“ an Heiligabend nur Klavier. Keine Trompete (klang schlecht).
- Gewinn-Feier auch beim automatischen Wiederöffnen einer Tür erneut.
- Noch geschlossene Türen werden beim Hinterlegen neuer Kalendernummern **nicht** geprüft (keine Spoiler).
- Türrand: weiß, gestrichelt, 35 % Deckkraft.
- Neue Funktionen für die Pflege (Editor, Test-Buttons) nur bei `ng serve` sichtbar und in der README dokumentieren.

## Deployment – häufige Fehlerquelle!

- Hosting: Azure Storage Account **`kalender`** (mit **e**!), Container **`$web`**, ausgeliefert über **Cloudflare** unter `www.oldenburger-adventskalender.de`. (Ein Account `kalendar` mit a existiert, ist aber leer/falsch.)
- Hochgeladen wird der **Inhalt** von `dist/advents-kalender/browser` ins **Root** von `$web` – **nicht** den Ordner `dist/advents-kalender` oder `browser` selbst. Passiert das, landet die App in `$web/browser/` und die PWA findet kein Update (ist zweimal vorgekommen).
- `ngsw.json` **zuletzt** hochladen. Alte gehashte Dateien möglichst nicht löschen.
- Prüfen nach dem Deployment: `https://www.oldenburger-adventskalender.de/ngsw.json` (Zeitstempel) und ob `index.html` die neue `main-….js` lädt; bei Problemen alle Dateien gegen die Hashes in `ngsw.json` prüfen.
- `deploy.cmd` setzt Cache-Header und erwartet den SAS-Token als Umgebungsvariable `KALENDER_SAS` (niemals Tokens in Dateien schreiben oder committen). Der Azure-CDN-Purge darin ist wirkungslos (Seite läuft über Cloudflare).
- Cloudflare-Cache-Regeln (App-Shell `no-cache`, gehashte Bundles 1 Jahr): siehe README, Abschnitt „Cloudflare“.

## Neues Kalenderbild (jährlich)

`src/assets/kalender.jpg` (1200 px breit). Bei anderem Seitenverhältnis an drei Stellen anpassen: `aspect-ratio` in `kalender.component.scss`, `(rect.width * 847) / 1200` in `kalender.component.ts`, `KALENDER_IMAGE_WIDTH/HEIGHT` in `twinkle-lights.ts`. Danach Lichter neu einrichten. Originale liegen in `artwork/` (wird nicht deployt).

## Offene Punkte (Stand 16.11.2026)

- Unterordner `browser` im Build abschaffen (`angular.json`: `"outputPath": { "base": "dist/advents-kalender", "browser": "" }`), dann `deploy.cmd` und README anpassen – vom Nutzer noch nicht entschieden.
- Cloudflare-Cache-Regeln einrichten (Anleitung in README), danach Azure-CDN-Purge aus `deploy.cmd` entfernen.
- Neuen SAS-Token für Account `kalender` erzeugen, falls `deploy.cmd` genutzt wird.
- `azcopy.exe` ist nicht mehr versioniert (in `.gitignore`), liegt nur lokal.
- Grußtext in `christmas-eve.texts.ts` ist ein Entwurf; Spendensumme ist noch `null`.
