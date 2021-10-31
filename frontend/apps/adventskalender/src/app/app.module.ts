import { MaterialModule } from './shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function initializeApp(storage: Storage) {
  return () => {
    storage.defineDriver(CordovaSQLiteDriver);
    return storage.create();
  };
}

const routes: Routes = [
  { path: 'kalender', loadChildren: () => import('./kalender-layout/kalender-layout.module').then(m => m.KalenderLayoutModule) },
  { path: '**', redirectTo: 'kalender' }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver],
    }),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [Storage],
      useFactory: initializeApp,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
