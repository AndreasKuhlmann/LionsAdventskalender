import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { AppComponent } from './app.component';

export function initializeApp(storage: Storage) {
  return () => storage.defineDriver(CordovaSQLiteDriver);
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver],
    }),
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
