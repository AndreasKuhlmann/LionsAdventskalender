import { MaterialModule } from './shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdventDaysService } from './services/advent-days.service';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

export function initializeApp(storage: Storage) {
  return () => {
    storage.defineDriver(CordovaSQLiteDriver);
    return storage.create();
  };
}

const routes: Routes = [
  { path: 'adventskalender', loadChildren: () => import('./adventskalender/adventskalender.module').then(m => m.AdventskalenderModule) },
  { path: '**', redirectTo: 'adventskalender' }
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
    MaterialModule
  ],
  providers: [
    AdventDaysService,
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
