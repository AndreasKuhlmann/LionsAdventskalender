import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { APP_ROUTES } from './app.routes';
import { AppUpdateService } from './services/app-update.service';
import { InstallablePromptService } from './kalender-layout/services/installable-prompt.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'adventsKalender',
        storeName: 'DB',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
      })
    ),
    provideAppInitializer(() => {
      console.log('initializeApp: isDevMode() -> ', isDevMode());
      return inject(Storage).create();
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    // Neue Versionen nach einem Deployment möglichst schnell übernehmen
    provideAppInitializer(() => inject(AppUpdateService).init()),
    // Früh erzeugen, damit das "beforeinstallprompt"-Event nicht verpasst wird
    provideAppInitializer(() => void inject(InstallablePromptService)),
  ],
};
