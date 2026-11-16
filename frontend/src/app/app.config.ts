import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
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
  ],
};
