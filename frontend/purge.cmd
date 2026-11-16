@echo off
@REM Leert den CDN-Cache (z.B. nach manuellen Aenderungen im Storage). Voraussetzung: az login
call az cdn endpoint purge --resource-group adventskalender --profile-name kalendar --name kalendar --content-paths "/*"
