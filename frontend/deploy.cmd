@REM SAS-Token expires 2021-02-23!
@REM %-Zeichen müssen im SAS-Token in Batch-Datei immer mit %% ersetzt werden!!!!


azcopy sync dist\apps\adventskalender "https://kalendar.blob.core.windows.net/$web??sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-10-31T22:43:50Z&st=2021-10-31T14:43:50Z&spr=https&sig=35kbPyWiSgLfB7YO%%2Fwt2DCJ6GaRWT2i9rOMBx3bcfFA%%3D" --recursive=true --delete-destination=true

@REM azcopy remove "https://kalendar.blob.core.windows.net/$web??sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-10-31T22:43:50Z&st=2021-10-31T14:43:50Z&spr=https&sig=35kbPyWiSgLfB7YO%%2Fwt2DCJ6GaRWT2i9rOMBx3bcfFA%%3D" --recursive=true
@REM azcopy copy "dist\apps\adventskalender\*" "https://kalendar.blob.core.windows.net/$web??sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-10-31T22:43:50Z&st=2021-10-31T14:43:50Z&spr=https&sig=35kbPyWiSgLfB7YO%%2Fwt2DCJ6GaRWT2i9rOMBx3bcfFA%%3D" --recursive=true --overwrite=true

az cdn endpoint purge --resource-group adventskalender --profile-name kalendar --name kalendar --content-paths=/*

@REM cmd.exe /c az storage blob delete-batch --source $web --account-name kalendar
@REM cmd.exe /c az storage blob upload-batch --destination $web --source ./dist --account-name kalendar
@REM cmd.exe /c az storage blob sync --container $web --source ./dist --account-name kalendar
