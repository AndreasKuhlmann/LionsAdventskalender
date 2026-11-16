@echo off
setlocal

@REM ---------------------------------------------------------------------------
@REM Deployment des Adventskalenders nach Azure Blob Storage ($web) + CDN-Purge.
@REM
@REM Der SAS-Token wird NICHT mehr in dieser Datei gespeichert, sondern muss als
@REM Umgebungsvariable gesetzt sein (nur der Teil nach dem "?", in Anfuehrungszeichen
@REM wegen der "&"-Zeichen):
@REM
@REM   set "KALENDER_SAS=sv=...&ss=...&sig=..."
@REM   deploy.cmd
@REM
@REM Voraussetzungen: azcopy im PATH, az CLI angemeldet (az login), "ng build" gelaufen.
@REM ---------------------------------------------------------------------------

if not defined KALENDER_SAS (
  echo Fehler: Umgebungsvariable KALENDER_SAS ist nicht gesetzt.
  exit /b 1
)

set "SRC=dist\advents-kalender\browser"
set "DEST=https://kalender.blob.core.windows.net/$web?%KALENDER_SAS%"
set "WORKERS=ngsw-worker.js;safety-worker.js;worker-basic.min.js"

if not exist "%SRC%\ngsw.json" (
  echo Fehler: %SRC%\ngsw.json fehlt - bitte zuerst "ng build" ausfuehren.
  exit /b 1
)

@REM Schritt 1: Gehashte Bundles (main-XYZ.js, styles-XYZ.css, ...). Der Inhalt einer solchen
@REM            Datei aendert sich nie, sie darf daher dauerhaft gecacht werden.
@REM            Alte Bundles bleiben liegen, damit Clients mit der Vorversion ihre Dateien
@REM            noch nachladen koennen.
azcopy copy "%SRC%\*" "%DEST%" --recursive=true ^
  --include-pattern="*.js;*.css" --exclude-pattern="%WORKERS%" ^
  --cache-control="public, max-age=31536000, immutable" --overwrite=ifSourceNewer || exit /b 1

@REM Schritt 2: Alle uebrigen Dateien (index.html, Manifest, Assets, Service Worker) ohne ngsw.json.
@REM            "no-cache" = Browser und CDN muessen bei jedem Abruf beim Server nachfragen.
azcopy copy "%SRC%\*" "%DEST%" --recursive=true ^
  --exclude-pattern="ngsw.json;*.js;*.css" ^
  --cache-control="no-cache" --overwrite=true || exit /b 1
azcopy copy "%SRC%\*" "%DEST%" ^
  --include-pattern="%WORKERS%" ^
  --cache-control="no-cache" --overwrite=true || exit /b 1

@REM Schritt 3: ngsw.json ganz zum Schluss. Erst jetzt erkennen die Service Worker der Clients
@REM            die neue Version - und alle dazugehoerigen Dateien sind bereits vorhanden.
azcopy copy "%SRC%\ngsw.json" "%DEST%" --cache-control="no-cache" --overwrite=true || exit /b 1

@REM Schritt 4: CDN-Cache leeren.
call az cdn endpoint purge --resource-group adventskalender --profile-name kalendar --name kalendar --content-paths "/*"

endlocal
