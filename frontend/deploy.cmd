@REM SAS-Token expires 2021-02-23!
@REM %-Zeichen müssen im SAS-Token in Batch-Datei immer mit %% ersetzt werden!!!!


azcopy sync dist\apps\adventskalender "https://kalendar.blob.core.windows.net/$web??sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-11T20:26:12Z&st=2023-11-10T12:26:12Z&spr=https&sig=nGWE%%2Bjaq9pMdfWsHKBbtOO4VWa8WS5nmGyW3CkzImdM%%3D" --recursive=true --delete-destination=true

@REM azcopy remove "https://kalendar.blob.core.windows.net/$web??sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-11T20:26:12Z&st=2023-11-10T12:26:12Z&spr=https&sig=nGWE%%2Bjaq9pMdfWsHKBbtOO4VWa8WS5nmGyW3CkzImdM%%3D" --recursive=true
@REM azcopy copy "dist\apps\adventskalender\*" "https://kalendar.blob.core.windows.net/$web??sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-11T20:26:12Z&st=2023-11-10T12:26:12Z&spr=https&sig=nGWE%%2Bjaq9pMdfWsHKBbtOO4VWa8WS5nmGyW3CkzImdM%%3D" --recursive=true --overwrite=true

az cdn endpoint purge --resource-group adventskalender --profile-name kalendar --name kalendar --content-paths=/*

@REM cmd.exe /c az storage blob delete-batch --source $web --account-name kalendar
@REM cmd.exe /c az storage blob upload-batch --destination $web --source ./dist --account-name kalendar
@REM cmd.exe /c az storage blob sync --container $web --source ./dist --account-name kalendar
